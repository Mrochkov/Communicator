from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import Message, Conversation
from django.contrib.auth import get_user_model
import base64
import uuid

User = get_user_model()


class ChatConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.user = None

    def connect(self):
        self.user = self.scope["user"]
        self.channel_id = self.scope["url_route"]["kwargs"].get("channelId")

        if not self.user.is_authenticated:
            self.close(code=4001)
            return

        if not self.channel_id or not self.channel_id.isalnum():
            self.close(code=4002)
            return

        async_to_sync(self.channel_layer.group_add)(self.channel_id, self.channel_name)
        self.accept()

    def receive_json(self, content):
        channel_id = self.channel_id
        sender = self.user
        message_content = content.get("message")
        image_data = content.get("image")
        reply_to_id = content.get("reply_to")

        conversation, _ = Conversation.objects.get_or_create(channel_id=channel_id)

        reply_to_message = None
        if reply_to_id:
            reply_to_message = get_object_or_404(Message, id=reply_to_id, conversation=conversation)

        image_file = None
        if image_data:
            image_file = self.save_image(image_data)

        new_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=message_content,
            image=image_file,
            reply_to=reply_to_message,
        )

        async_to_sync(self.channel_layer.group_send)(
            self.channel_id,
            {
                "type": "chat.message",
                "new_message": {
                    "id": new_message.id,
                    "sender": new_message.sender.username,
                    "sender_avatar": new_message.sender.avatar.url if new_message.sender.avatar else None,
                    "content": new_message.content,
                    "image_url": new_message.image.url if new_message.image else None,
                    "timestamp": new_message.timestamp.isoformat(),
                    "reply_to": {
                        "id": reply_to_message.id,
                        "content": reply_to_message.content,
                        "sender": reply_to_message.sender.username,
                    } if reply_to_message else None,
                },
            },
        )

    def chat_message(self, event):
        self.send_json(event)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.channel_id, self.channel_name)

    def save_image(self, image_data):
        """
        Decodes base64 image data, saves the image file, and returns the file path.
        """
        try:
            format, img_str = image_data.split(";base64,")
            ext = format.split("/")[-1]
            img_data = base64.b64decode(img_str)

            file_name = f"{uuid.uuid4()}.{ext}"
            file_path = f"uploads/{file_name}"

            default_storage.save(file_path, ContentFile(img_data))
            return file_path
        except Exception as e:
            print(f"Error saving image: {e}")
            return None
