from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from .models import UserProfile, Memorial, Memory


class UserProfileModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_user_profile_creation(self):
        """Test that UserProfile is created automatically when User is created"""
        self.assertTrue(hasattr(self.user, 'userprofile'))
        self.assertFalse(self.user.userprofile.verified)
    
    def test_user_profile_str(self):
        """Test the string representation of UserProfile"""
        expected = f"{self.user.username} - Unverified"
        self.assertEqual(str(self.user.userprofile), expected)


class MemorialModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.user_profile = self.user.userprofile
        
    def test_memorial_creation(self):
        """Test creating a memorial"""
        memorial = Memorial.objects.create(
            owner=self.user_profile,
            name='Test Person',
            bio='A test person',
            visibility='public'
        )
        self.assertEqual(memorial.name, 'Test Person')
        self.assertTrue(memorial.slug)
        self.assertEqual(memorial.visibility, 'public')


class ViewsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.user.userprofile.verified = True
        self.user.userprofile.save()
        
        self.memorial = Memorial.objects.create(
            owner=self.user.userprofile,
            name='Test Person',
            bio='A test biography',
            visibility='public'
        )
    
    def test_home_view(self):
        """Test the home page view"""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Honoring Lives, Preserving Memories')
        
    def test_explore_view(self):
        """Test the explore page view"""
        response = self.client.get(reverse('explore'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.memorial.name)
