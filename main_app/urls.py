from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Main pages
    path('', views.home, name='home'),
    path('explore/', views.explore, name='explore'),
    path('dashboard/', views.user_dashboard, name='dashboard'),
    
    # Memorial pages
    path('memorial/new/', views.create_memorial, name='create_memorial'),
    path('m/<slug:slug>/', views.memorial_detail, name='memorial_detail'),
    
    # Authentication
    path('signup/', views.signup, name='signup'),
    path('login/', auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('verify/', views.verify_email, name='verify_email'),
    
    # API endpoints
    path('api/copy-link/', views.copy_link, name='copy_link'),
]
