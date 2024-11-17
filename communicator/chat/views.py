from django.contrib.messages.storage.cookie import MessageSerializer
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from chat.models import Conversation

from .serializers import MessageSerializer, TranslateSerializer
from .schemas import list_message_docs
from .translator_service import translate_text


class MessageViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    @list_message_docs
    def list(self, request):
        channel_id = request.query_params.get('channel_id')

        try:
            conversation = Conversation.objects.get(channel_id=channel_id)
            message = conversation.messages.all()
            serializer = MessageSerializer(message, many=True)
            return Response(serializer.data)

        except Conversation.DoesNotExist:
            return Response([])

@extend_schema(
    request=TranslateSerializer,
    responses={200: TranslateSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def translate_view(request):
    text = request.data.get('text')
    target_language = request.data.get('to')

    if not text or not target_language:
        return Response({"error": "Missing 'text' or 'to' field"}, status=status.HTTP_400_BAD_REQUEST)

    translation_result = translate_text(text, target_language)

    return Response(translation_result)