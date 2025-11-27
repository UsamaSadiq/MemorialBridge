from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Memorial, Memory


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user


class MemorialForm(forms.ModelForm):
    class Meta:
        model = Memorial
        fields = ['name', 'dob', 'dod', 'bio', 'cover_image', 'visibility']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Full name',
                'maxlength': '200'
            }),
            'dob': forms.DateInput(attrs={
                'class': 'form-control', 
                'type': 'date'
            }),
            'dod': forms.DateInput(attrs={
                'class': 'form-control', 
                'type': 'date'
            }),
            'bio': forms.Textarea(attrs={
                'class': 'form-control', 
                'rows': 5, 
                'placeholder': 'Share their story...'
            }),
            'cover_image': forms.FileInput(attrs={
                'class': 'form-control'
            }),
            'visibility': forms.Select(attrs={
                'class': 'form-select'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove any maxlength attribute from bio field
        if 'bio' in self.fields:
            self.fields['bio'].widget.attrs.pop('maxlength', None)
            # Also check if there's a max_length on the field itself
            if hasattr(self.fields['bio'], 'max_length'):
                self.fields['bio'].max_length = None


class MemoryForm(forms.ModelForm):
    class Meta:
        model = Memory
        fields = ['type', 'content', 'image', 'video_url']
        widgets = {
            'type': forms.Select(attrs={'class': 'form-select', 'id': 'memory-type'}),
            'content': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Share a memory...'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'video_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'YouTube or video URL'}),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        memory_type = cleaned_data.get('type')
        content = cleaned_data.get('content')
        image = cleaned_data.get('image')
        video_url = cleaned_data.get('video_url')
        
        if memory_type == 'text' and not content:
            raise forms.ValidationError("Text memories must have content.")
        elif memory_type == 'image' and not image:
            raise forms.ValidationError("Image memories must have an image.")
        elif memory_type == 'video' and not video_url:
            raise forms.ValidationError("Video memories must have a video URL.")
        
        return cleaned_data
