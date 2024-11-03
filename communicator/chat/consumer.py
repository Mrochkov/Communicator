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
        try:
            self.user = self.scope["user"]
            self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]
            self.accept()

            if not self.user.is_authenticated:
                self.close(code=4001)
                return

            try:
                server = Server.objects.get(id=self.channel_id)
            except Server.DoesNotExist:
                print(f"Server with ID {self.channel_id} does not exist.")
                self.close(code=4004)
                return

            self.is_member = server.member.filter(id=self.user.id).exists()
            if not self.is_member:
                print(f"User {self.user.id} is not a member of server {self.channel_id}")
                self.close(code=4003)
                return

            async_to_sync(self.channel_layer.group_add)(
                f"server_{self.channel_id}", self.channel_name
            )

        except Exception as e:
            print(f"Error during WebSocket connection: {e}")
            self.close(code=1011)

    def receive_json(self, content):

        if not self.is_member:
            self.send_json({"error": "You are not a member of this server"})
            print("User is not a member; closing connection.")
            self.close(code=4003)
            return

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