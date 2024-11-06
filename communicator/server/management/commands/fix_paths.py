# management/commands/fix_paths.py

from django.core.management.base import BaseCommand
from server.models import Server

class Command(BaseCommand):
    help = 'Fix media paths in Server model'

    def handle(self, *args, **kwargs):
        for server in Server.objects.all():
            if server.icon and server.icon.path.startswith("media/"):
                server.icon.name = server.icon.name.replace("media/", "", 1)
            if server.banner and server.banner.path.startswith("media/"):
                server.banner.name = server.banner.name.replace("media/", "", 1)
            server.save()
        self.stdout.write(self.style.SUCCESS('Successfully fixed paths!'))
