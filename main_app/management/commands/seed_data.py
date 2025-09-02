from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from main_app.models import UserProfile, Memorial, Memory
from datetime import date


class Command(BaseCommand):
    help = 'Load seed data for MemorialBridge'
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Loading seed data...'))
        
        # Create demo user
        demo_user, created = User.objects.get_or_create(
            username='demo',
            defaults={
                'email': 'demo@memorialbridge.com',
                'first_name': 'Demo',
                'last_name': 'User'
            }
        )
        
        if created:
            demo_user.set_password('demo1234')
            demo_user.save()
            self.stdout.write(f'Created demo user: {demo_user.username}')
        
        # Get or create user profile and verify it
        demo_profile, created = UserProfile.objects.get_or_create(
            user=demo_user,
            defaults={'verified': True}
        )
        demo_profile.verified = True
        demo_profile.save()
        
        # Create memorials
        memorials_data = [
            {
                'name': 'Abdul Sattar Edhi',
                'dob': date(1928, 2, 28),
                'dod': date(2016, 7, 8),
                'bio': 'A Pakistani philanthropist, ascetic, and humanitarian who founded the Edhi Foundation, which ran hospitals, homeless shelters, and orphanages and had an emergency service with over 1,500 ambulances to serve the poor. Known as "Angel of Mercy" and considered one of the greatest humanitarians of all time.',
                'donations_count': 150,
                'trees_planted_count': 89,
                'memories': [
                    {
                        'type': 'text',
                        'content': 'I remember seeing Edhi sahib personally driving an ambulance to help accident victims. His dedication to humanity was unmatched. He lived a simple life but served millions.'
                    },
                    {
                        'type': 'text', 
                        'content': 'My grandmother was helped by the Edhi Foundation when she had nowhere to go. He was truly an angel for the poor and helpless.'
                    },
                    {
                        'type': 'video',
                        'video_url': 'https://www.youtube.com/watch?v=sample-edhi'
                    }
                ]
            },
            {
                'name': 'Ustad Nusrat Fateh Ali Khan',
                'dob': date(1948, 10, 13),
                'dod': date(1997, 8, 16),
                'bio': 'A Pakistani vocalist, musician, composer and music director, primarily a singer of qawwali, a form of Sufi devotional music. He possessed an extraordinary range of vocal abilities and could perform at a high level of intensity for several hours. He is widely credited with introducing qawwali music to international audiences.',
                'donations_count': 98,
                'trees_planted_count': 134,
                'memories': [
                    {
                        'type': 'text',
                        'content': 'His voice could transport you to another world. Listening to "Allah Hoo" still gives me chills. The passion and spirituality in his singing was divine.'
                    },
                    {
                        'type': 'text',
                        'content': 'I was fortunate to attend one of his live concerts in Lahore. The entire crowd was mesmerized. His music transcended all boundaries of language and culture.'
                    }
                ]
            },
            {
                'name': 'Madam Noor Jehan',
                'dob': date(1926, 9, 21),
                'dod': date(2000, 12, 23),
                'bio': 'A Pakistani playback singer and actress who worked first in British India and then in Pakistan. Her career spanned more than six decades (1930s–1990s). She was known as "Malika-e-Tarannum" (Queen of Melody) and is considered one of the greatest singers in the subcontinent. She lent her voice to many Pakistani patriotic songs.',
                'donations_count': 76,
                'trees_planted_count': 112,
                'memories': [
                    {
                        'type': 'text',
                        'content': 'Her patriotic songs during the 1965 war boosted the morale of the entire nation. "Ae Watan Ke Sajeele Jawano" still brings tears to my eyes.'
                    },
                    {
                        'type': 'text',
                        'content': 'My mother used to sing her songs while doing household work. Noor Jehan\'s voice was the soundtrack of our childhood.'
                    }
                ]
            }
        ]
        
        for memorial_data in memorials_data:
            # Extract memories data
            memories_data = memorial_data.pop('memories', [])
            
            # Create or get memorial
            memorial, created = Memorial.objects.get_or_create(
                name=memorial_data['name'],
                defaults={
                    **memorial_data,
                    'owner': demo_profile,
                    'visibility': 'public'
                }
            )
            
            if created:
                self.stdout.write(f'Created memorial: {memorial.name}')
                
                # Create memories for this memorial
                for memory_data in memories_data:
                    Memory.objects.create(
                        memorial=memorial,
                        author=demo_user,
                        **memory_data
                    )
                    self.stdout.write(f'  Added memory: {memory_data["type"]}')
            else:
                self.stdout.write(f'Memorial already exists: {memorial.name}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully loaded seed data!')
        )
        self.stdout.write(
            self.style.WARNING('Demo user credentials: username=demo, password=demo1234')
        )
