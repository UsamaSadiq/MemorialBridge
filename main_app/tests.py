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
        
    def test_memorial_slug_generation(self):
        """Test that slugs are generated automatically"""
        memorial = Memorial.objects.create(
            owner=self.user_profile,
            name='Test Person With Spaces',
            visibility='public'
        )
        self.assertEqual(memorial.slug, 'test-person-with-spaces')
        
    def test_memorial_total_contributions(self):
        """Test the total contributions calculation"""
        memorial = Memorial.objects.create(
            owner=self.user_profile,
            name='Test Person',
            donations_count=5,
            trees_planted_count=3,
            visibility='public'
        )
        self.assertEqual(memorial.total_contributions(), 8)


class MemoryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.memorial = Memorial.objects.create(
            owner=self.user.userprofile,
            name='Test Person',
            visibility='public'
        )
        
    def test_memory_creation(self):
        """Test creating a memory"""
        memory = Memory.objects.create(
            memorial=self.memorial,
            author=self.user,
            type='text',
            content='A fond memory'
        )
        self.assertEqual(memory.content, 'A fond memory')
        self.assertEqual(memory.type, 'text')
        
    def test_memory_str(self):
        """Test the string representation of Memory"""
        memory = Memory.objects.create(
            memorial=self.memorial,
            author=self.user,
            type='text',
            content='A fond memory'
        )
        expected = f"Text by {self.user.username} for {self.memorial.name}"
        self.assertEqual(str(memory), expected)


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
        
    def test_memorial_detail_view(self):
        """Test the memorial detail view"""
        response = self.client.get(reverse('memorial_detail', kwargs={'slug': self.memorial.slug}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.memorial.name)
        self.assertContains(response, self.memorial.bio)
        
    def test_create_memorial_requires_login(self):
        """Test that creating a memorial requires login"""
        response = self.client.get(reverse('create_memorial'))
        self.assertRedirects(response, '/login/?next=/memorial/new/')
        
    def test_create_memorial_requires_verification(self):
        """Test that creating a memorial requires verified account"""
        # Create unverified user
        unverified_user = User.objects.create_user(
            username='unverified',
            email='unverified@example.com',
            password='testpass123'
        )
        self.client.login(username='unverified', password='testpass123')
        
        response = self.client.get(reverse('create_memorial'))
        self.assertRedirects(response, reverse('verify_email'))
        
    def test_dashboard_requires_login(self):
        """Test that dashboard requires login"""
        response = self.client.get(reverse('dashboard'))
        self.assertRedirects(response, '/login/?next=/dashboard/')
        
    def test_memorial_search(self):
        """Test memorial search functionality"""
        response = self.client.get(reverse('explore') + '?search=Test')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.memorial.name)
        
        # Test search with no results
        response = self.client.get(reverse('explore') + '?search=NonExistent')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'No memorials found')


class AuthenticationTest(TestCase):
    def test_signup_view(self):
        """Test the signup view"""
        response = self.client.get(reverse('signup'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Join MemorialBridge')
        
    def test_signup_post(self):
        """Test posting to signup view"""
        response = self.client.post(reverse('signup'), {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'complexpassword123',
            'password2': 'complexpassword123'
        })
        self.assertRedirects(response, reverse('verify_email'))
        self.assertTrue(User.objects.filter(username='newuser').exists())
        
    def test_login_view(self):
        """Test the login view"""
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Welcome Back')
        
    def test_verify_email_view(self):
        """Test the email verification view"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.login(username='testuser', password='testpass123')
        
        response = self.client.get(reverse('verify_email'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Email Verification')
        
        # Test verification POST
        response = self.client.post(reverse('verify_email'))
        user.userprofile.refresh_from_db()
        self.assertTrue(user.userprofile.verified)
        self.assertRedirects(response, reverse('dashboard'))


class ContributionTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.memorial = Memorial.objects.create(
            owner=self.user.userprofile,
            name='Test Person',
            visibility='public'
        )
        
    def test_donation_contribution(self):
        """Test donation contribution functionality"""
        self.client.login(username='testuser', password='testpass123')
        
        initial_count = self.memorial.donations_count
        response = self.client.post(
            reverse('memorial_detail', kwargs={'slug': self.memorial.slug}),
            {'donate': ''}
        )
        
        self.memorial.refresh_from_db()
        self.assertEqual(self.memorial.donations_count, initial_count + 1)
        self.assertRedirects(response, reverse('memorial_detail', kwargs={'slug': self.memorial.slug}))
        
    def test_tree_planting_contribution(self):
        """Test tree planting contribution functionality"""
        self.client.login(username='testuser', password='testpass123')
        
        initial_count = self.memorial.trees_planted_count
        response = self.client.post(
            reverse('memorial_detail', kwargs={'slug': self.memorial.slug}),
            {'plant_tree': ''}
        )
        
        self.memorial.refresh_from_db()
        self.assertEqual(self.memorial.trees_planted_count, initial_count + 1)
        self.assertRedirects(response, reverse('memorial_detail', kwargs={'slug': self.memorial.slug'}))


class MemorySubmissionTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.memorial = Memorial.objects.create(
            owner=self.user.userprofile,
            name='Test Person',
            visibility='public'
        )
        
    def test_text_memory_submission(self):
        """Test submitting a text memory"""
        self.client.login(username='testuser', password='testpass123')
        
        response = self.client.post(
            reverse('memorial_detail', kwargs={'slug': self.memorial.slug}),
            {
                'memory_submit': '1',
                'type': 'text',
                'content': 'This is a fond memory'
            }
        )
        
        self.assertRedirects(response, reverse('memorial_detail', kwargs={'slug': self.memorial.slug}))
        self.assertTrue(Memory.objects.filter(
            memorial=self.memorial,
            content='This is a fond memory'
        ).exists())
