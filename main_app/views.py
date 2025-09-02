from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, F
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Memorial, Memory, UserProfile
from .forms import CustomUserCreationForm, MemorialForm, MemoryForm


def home(request):
    """
    Landing page with featured memorials carousel
    """
    # Get top 3 memorials by total contributions
    featured_memorials = Memorial.objects.filter(
        visibility='public'
    ).annotate(
        total_contributions=F('donations_count') + F('trees_planted_count')
    ).order_by('-total_contributions')[:3]
    
    context = {
        'featured_memorials': featured_memorials
    }
    return render(request, 'main_app/home.html', context)


def explore(request):
    """
    Browse and search public memorials
    """
    search_query = request.GET.get('search', '')
    memorials = Memorial.objects.filter(visibility='public')
    
    if search_query:
        memorials = memorials.filter(
            Q(name__icontains=search_query) | Q(bio__icontains=search_query)
        )
    
    context = {
        'memorials': memorials,
        'search_query': search_query
    }
    return render(request, 'main_app/explore.html', context)


def memorial_detail(request, slug):
    """
    Memorial detail page with memories and contribution functionality
    """
    memorial = get_object_or_404(Memorial, slug=slug)
    
    # Check if user can view this memorial
    if memorial.visibility == 'private' and (
        not request.user.is_authenticated or 
        memorial.owner.user != request.user
    ):
        messages.error(request, "This memorial is private.")
        return redirect('explore')
    
    memories = memorial.memories.all()
    memory_form = MemoryForm()
    
    if request.method == 'POST':
        if not request.user.is_authenticated:
            messages.error(request, "Please log in to add memories or contribute.")
            return redirect('login')
        
        # Handle memory submission
        if 'memory_submit' in request.POST:
            memory_form = MemoryForm(request.POST, request.FILES)
            if memory_form.is_valid():
                memory = memory_form.save(commit=False)
                memory.memorial = memorial
                memory.author = request.user
                memory.save()
                messages.success(request, "Memory added successfully!")
                return redirect('memorial_detail', slug=slug)
        
        # Handle contributions
        elif 'donate' in request.POST:
            memorial.donations_count += 1
            memorial.save()
            messages.success(request, "Thank you for your donation!")
            return redirect('memorial_detail', slug=slug)
        
        elif 'plant_tree' in request.POST:
            memorial.trees_planted_count += 1
            memorial.save()
            messages.success(request, "Thank you for planting a tree!")
            return redirect('memorial_detail', slug=slug)
    
    context = {
        'memorial': memorial,
        'memories': memories,
        'memory_form': memory_form,
        'can_edit': request.user.is_authenticated and memorial.owner.user == request.user
    }
    return render(request, 'main_app/memorial_detail.html', context)


@login_required
def create_memorial(request):
    """
    Create a new memorial (protected view)
    """
    # Check if user is verified
    try:
        user_profile = request.user.userprofile
        if not user_profile.verified:
            messages.error(request, "Please verify your email address before creating memorials.")
            return redirect('verify_email')
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=request.user)
        messages.error(request, "Please verify your email address before creating memorials.")
        return redirect('verify_email')
    
    if request.method == 'POST':
        form = MemorialForm(request.POST, request.FILES)
        if form.is_valid():
            memorial = form.save(commit=False)
            memorial.owner = user_profile
            memorial.save()
            messages.success(request, f"Memorial for {memorial.name} created successfully!")
            return redirect('memorial_detail', slug=memorial.slug)
    else:
        form = MemorialForm()
    
    context = {'form': form}
    return render(request, 'main_app/create_memorial.html', context)


@login_required
def user_dashboard(request):
    """
    User's personal dashboard showing their memorials
    """
    try:
        user_profile = request.user.userprofile
        memorials = user_profile.memorials.all()
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=request.user)
        memorials = []
    
    context = {
        'memorials': memorials,
        'user_profile': user_profile
    }
    return render(request, 'main_app/dashboard.html', context)


def signup(request):
    """
    User registration
    """
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, "Account created successfully! Please verify your email.")
            login(request, user)
            return redirect('verify_email')
    else:
        form = CustomUserCreationForm()
    
    context = {'form': form}
    return render(request, 'auth/signup.html', context)


@login_required
def verify_email(request):
    """
    Simulated email verification
    """
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        user_profile.verified = True
        user_profile.save()
        messages.success(request, "Email verified successfully! You can now create memorials.")
        return redirect('dashboard')
    
    if user_profile.verified:
        return redirect('dashboard')
    
    return render(request, 'auth/verify_email.html')


@require_POST
@csrf_exempt
def copy_link(request):
    """
    API endpoint for copying memorial link
    """
    data = json.loads(request.body)
    slug = data.get('slug')
    
    if slug:
        memorial = get_object_or_404(Memorial, slug=slug)
        link = request.build_absolute_uri(memorial.get_absolute_url())
        return JsonResponse({'success': True, 'link': link})
    
    return JsonResponse({'success': False})
