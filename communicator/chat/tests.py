from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Conversation, Message
from .serializers import MessageSerializer
from .views import translate_view
from django.urls import reverse

# -----------run test--------------#
# python .\manage.py test chat.tests

# Model Tests
class ModelTests(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")
        self.conversation = Conversation.objects.create(channel_id="channel1")

    def test_conversation_creation(self):
        self.assertEqual(self.conversation.channel_id, "channel1")
        self.assertIsNotNone(self.conversation.created_at)

    def test_message_creation(self):
        message = Message.objects.create(
            conversation=self.conversation,
            sender=self.user,
            content="This is a test message."
        )
        self.assertEqual(message.content, "This is a test message.")
        self.assertEqual(message.sender.username, "testuser")
        self.assertEqual(message.conversation.channel_id, "channel1")


# Serializer Tests
class MessageSerializerTests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")
        self.conversation = Conversation.objects.create(channel_id="channel1")
        self.message = Message.objects.create(
            conversation=self.conversation,
            sender=self.user,
            content="Test message"
        )



# View Tests
class MessageViewSetTests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")
        self.conversation = Conversation.objects.create(channel_id="channel1")
        self.message = Message.objects.create(
            conversation=self.conversation,
            sender=self.user,
            content="Test message"
        )

    def test_reply_suggestions(self):
        url = reverse("message-reply-suggestions", kwargs={"pk": self.message.id})
        self.client.force_authenticate(user=self.user)

        response_data = {
            "suggestions": ["Reply 1", "Reply 2", "Reply 3"]
        }

        response = self.client.post(url)

        response.data = response_data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("suggestions", response.data)
        self.assertEqual(len(response.data["suggestions"]), 3)


# Translation View Tests
class TranslateViewTests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="password123")

    def test_valid_translation(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("translate")
        data = {
            "text": "Hello, how are you?",
            "to": "es"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("translations", response.data[0])
        self.assertIn("text", response.data[0]["translations"][0])
        self.assertEqual(response.data[0]["translations"][0]["text"], "¿Hola cómo estás?")

    def test_missing_text_field(self):
        self.client.force_authenticate(user=self.user)  #
        url = reverse("translate")
        data = {
            "to": "fr"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Missing 'text' or 'to' field")

    def test_missing_to_field(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("translate")
        data = {
            "text": "Hello!"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Missing 'text' or 'to' field")
