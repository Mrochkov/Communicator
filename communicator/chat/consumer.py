import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
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
        # self.is_member = None
        # self.server_id = kwargs.get('server_id')

    def update_membership(self, event):
        user_id = event["user_id"]
        is_member = event["is_member"]
        if self.user.id == user_id:
            self.is_member = is_member

    def connect(self):

        self.user = self.scope["user"]
        self.accept()
        if not self.user.is_authenticated:
            print(self.user)
            self.close(code=4001)

        # Called on connection.
        # To accept the connection call:
        self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]

        self.user = User.objects.get(id=self.user.id)

        async_to_sync(self.channel_layer.group_add)(
            self.channel_id,
            self.channel_name
        )

    def receive_json(self, content):

        channel_id = self.channel_id
        sender_id = self.user
        message = content["message"]

        conversation, created = Conversation.objects.get_or_create(channel_id=channel_id)

        new_message = Message.objects.create(conversation=conversation, sender_id=sender_id, content=message)

        async_to_sync(self.channel_layer.group_send)(
            self.channel_id,
            {
                "type": "chat.message",
                "new_message":
                {
                    "id": new_message.id,
                    "sender": new_message.sender_id.username,
                    "content": new_message.content,
                    "timestamp": new_message.timestamp.isoformat(),
                },
            },
        )

    def chat_message(self, event):
        self.send_json(event)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.channel_id, self.channel_name)
        print(f"Disconnected from channel {self.channel_id} with close code {close_code}")
        super().disconnect(close_code or 1000)