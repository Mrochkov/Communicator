import sys
import os
from unittest import TestCase

from django.core.files.uploadedfile import SimpleUploadedFile

current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(current_dir)

sys.path.append(project_dir)

#from .models import Account

# -----------run test--------------#
# python .\manage.py test account.tests


from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from account.models import Account

class UserModelTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "username": "testuser",
            "password": "password123",
        }
        self.user = Account.objects.create_user(**self.user_data)

    def test_user_creation(self):
        user = Account.objects.get(username="testuser")
        self.assertEqual(user.username, "testuser")
        self.assertTrue(user.check_password("password123"))

    def test_user_str(self):
        self.assertEqual(str(self.user), self.user.username)

    def test_user_language_default(self):
        self.assertEqual(self.user.language, "en")

class SignUpTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.valid_data = {"username": "newuser", "password": "newpassword123"}
        self.invalid_data = {"username": "newuser", "password": "short"}

    def test_signup_valid(self):
        url = reverse("signup")
        response = self.client.post(url, self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(Account.objects.get().username, "newuser")



class AvatarTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "username": "avataruser",
            "password": "password123",
        }
        self.user = Account.objects.create_user(**self.user_data)

    def test_avatar_upload(self):
        url = reverse("avatar-update", kwargs={"user_id": self.user.id})
        avatar = SimpleUploadedFile("avatar.jpg", b"file_content", content_type="image/jpeg")
        data = {"avatar": avatar}
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("avatar_url", response.data)

    def test_avatar_upload_no_file(self):
        url = reverse("avatar-update", kwargs={"user_id": self.user.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "No avatar uploaded.")

class LogoutTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = Account.objects.create_user(username="testuser", password="password123")

