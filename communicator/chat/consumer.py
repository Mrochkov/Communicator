import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404

from .models import Message, Conversation
from django.contrib.auth import get_user_model
from server.models import Server

#from communicator.server.models import Server

User = get_user_model()

class ChatConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.user = None
        self.is_member = False

    def update_membership(self, event):
        user_id = event["user_id"]
        is_member = event["is_member"]
        if self.user.id == user_id:
            self.is_member = is_member

    def connect(self):
        self.user = self.scope["user"]
        self.channel_id = self.scope["url_route"]["kwargs"].get("channelId")
        print(f"Connecting to channel: {self.channel_id}")  # Debugging

        if not self.user.is_authenticated:
            self.close(code=4001)
            return

        if not self.channel_id or not self.channel_id.isalnum():
            print(f"Invalid channel_id: {self.channel_id}")  # Debugging
            self.close(code=4002)
            return

        async_to_sync(self.channel_layer.group_add)(self.channel_id, self.channel_name)
        self.accept()

    def receive_json(self, content):
        channel_id = self.channel_id
        sender = self.user
        message = content["message"]
        reply_to_id = content.get("reply_to")  # Optional reply-to message ID

        # Fetch or create the conversation
        conversation, created = Conversation.objects.get_or_create(channel_id=channel_id)

        # Fetch the replied-to message if provided
        reply_to_message = None
        if reply_to_id:
            reply_to_message = get_object_or_404(Message, id=reply_to_id, conversation=conversation)

        # Create the new message with the reply_to relationship if applicable
        new_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=message,
            reply_to=reply_to_message,  # Save the reply-to relationship
        )

        # Broadcast the message with the reply-to information if available
        async_to_sync(self.channel_layer.group_send)(
            self.channel_id,
            {
                "type": "chat.message",
                "new_message": {
                    "id": new_message.id,
                    "sender": new_message.sender.username,
                    "sender_avatar": new_message.sender.avatar.url if new_message.sender.avatar else None,
                    "content": new_message.content,
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
        print(f"Disconnected from channel {self.channel_id} with close code {close_code}")
        # super().disconnect(close_code or 1000)