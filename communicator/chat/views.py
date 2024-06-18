from django.contrib.messages.storage.cookie import MessageSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from chat.models import Conversation
from .serializers import MessageSerializer
from .schemas import list_message_docs


class MessageViewSet(viewsets.ViewSet):
    @list_message_docs
    def list(self, request):
        channel_id = request.query_params.get('channel_id')
        conversation = Conversation.objects.get(channel_id=channel_id)
        message = conversation.message.all()

        serializer = MessageSerializer(message, many=True)
        return Response(serializer.data)
