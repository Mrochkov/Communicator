from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Account


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'language')
    search_fields = ('username',)

admin.site.register(Account, UserAdmin)
