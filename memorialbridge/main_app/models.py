from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls import reverse


class UserProfile(models.Model):
    """
    Extended user profile with verification status
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {'Verified' if self.verified else 'Unverified'}"


class Memorial(models.Model):
    """
    Memorial model for honoring individuals
    """
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='memorials')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    dob = models.DateField(null=True, blank=True, verbose_name="Date of Birth")
    dod = models.DateField(null=True, blank=True, verbose_name="Date of Passing")
    bio = models.TextField(blank=True, help_text="Biography or description")
    cover_image = models.ImageField(upload_to='memorial_covers/', blank=True, null=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    donations_count = models.IntegerField(default=0)
    trees_planted_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure unique slug
            counter = 1
            original_slug = self.slug
            while Memorial.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('memorial_detail', kwargs={'slug': self.slug})
    
    def total_contributions(self):
        return self.donations_count + self.trees_planted_count
    
    def __str__(self):
        return self.name


class Memory(models.Model):
    """
    User-contributed memories for memorials
    """
    MEMORY_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    memorial = models.ForeignKey(Memorial, on_delete=models.CASCADE, related_name='memories')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=MEMORY_TYPES)
    content = models.TextField(blank=True, help_text="Text content for text memories")
    image = models.ImageField(upload_to='memory_images/', blank=True, null=True)
    video_url = models.URLField(blank=True, help_text="YouTube or other video URL")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Memories'
    
    def __str__(self):
        return f"{self.get_type_display()} by {self.author.username} for {self.memorial.name}"
