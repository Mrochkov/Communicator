from django.contrib import admin

from .models import Channel, Server, Category

admin.site.register(Server)
admin.site.register(Category)


class ChannelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'server')
    search_fields = ('name',)

admin.site.register(Channel, ChannelAdmin)
