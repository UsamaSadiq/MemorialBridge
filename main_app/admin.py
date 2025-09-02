from django.contrib import admin
from .models import UserProfile, Memorial, Memory


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'verified']
    list_filter = ['verified']
    search_fields = ['user__username', 'user__email']


@admin.register(Memorial)
class MemorialAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'visibility', 'donations_count', 'trees_planted_count', 'created_at']
    list_filter = ['visibility', 'created_at']
    search_fields = ['name', 'bio']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ['memorial', 'author', 'type', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['memorial__name', 'author__username', 'content']
