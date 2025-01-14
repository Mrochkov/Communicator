from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Server, Category, Channel

User = get_user_model()

# -----------run test--------------#
# python .\manage.py test server.tests

class CategoryModelTestCase(TestCase):
    def test_create_category(self):
        category = Category.objects.create(name="Test Category")
        self.assertEqual(category.name, "test category")

    def test_category_str(self):
        category = Category.objects.create(name="Test Category")
        self.assertEqual(str(category), "test category")

    def test_duplicate_category(self):
        Category.objects.create(name="Duplicate")
        with self.assertRaises(Exception):
            Category.objects.create(name="Duplicate")


class ServerModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.category = Category.objects.create(name="Test Category")

    def test_create_server(self):
        server = Server.objects.create(name="Test Server", owner=self.user, category=self.category)
        self.assertEqual(server.name, "Test Server")
        self.assertEqual(server.owner, self.user)
        self.assertEqual(server.category, self.category)

    def test_server_str(self):
        server = Server.objects.create(name="Test Server", owner=self.user, category=self.category)
        self.assertTrue(str(server).startswith("Test Server-"))


    def test_server_with_long_name(self):
        long_name = "A" * 256
        with self.assertRaises(Exception):
            Server.objects.create(name=long_name, owner=self.user, category=self.category)


class ChannelModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.category = Category.objects.create(name="Test Category")
        self.server = Server.objects.create(name="Test Server", owner=self.user, category=self.category)

    def test_create_channel(self):
        channel = Channel.objects.create(name="Test Channel", owner=self.user, server=self.server, topic="General")
        self.assertEqual(channel.name, "Test Channel")
        self.assertEqual(channel.owner, self.user)
        self.assertEqual(channel.server, self.server)

    def test_channel_str(self):
        channel = Channel.objects.create(name="Test Channel", owner=self.user, server=self.server, topic="General")
        self.assertEqual(str(channel), "Test Channel")






class ServerPrivateValidationTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.category = Category.objects.create(name="Test Category")

    def test_private_server_requires_password(self):
        with self.assertRaises(ValueError):
            Server.objects.create(name="Private Server", owner=self.user, category=self.category, private=True)

    def test_public_server_does_not_require_password(self):
        server = Server.objects.create(name="Public Server", owner=self.user, category=self.category, private=False)
        self.assertEqual(server.private, False)

    def test_private_server_with_password(self):
        server = Server.objects.create(
            name="Private Server",
            owner=self.user,
            category=self.category,
            private=True,
            password="securepassword123"
        )
        self.assertTrue(server.private)
        self.assertEqual(server.password, "securepassword123")
