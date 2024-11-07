from django.db import models
from django.contrib.auth.models import AbstractUser


def user_avatar_upload_to(instance, filename):
    return f'avatars/{instance.id}/{filename}'


class Account(AbstractUser):
    avatar = models.ImageField(upload_to=user_avatar_upload_to, null=True, blank=True)

    def __str__(self):
        return self.username

