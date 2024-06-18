import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message, Conversation
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.user = None

    def connect(self):
        # Called on connection.
        # To accept the connection call:
        self.accept()
        self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]

        self.user = User.objects.get(id=1)

        async_to_sync(self.channel_layer.group_add)(
            self.channel_id,
            self.channel_name
        )
        # To reject the connection, call:
        # self.close()

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
        super().disconnect(close_code)
        #self.channel_layer.group_discard("my_group", self.channel_name)