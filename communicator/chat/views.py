from django.contrib.messages.storage.cookie import MessageSerializer
from django.http import JsonResponse
from openai import OpenAIError
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from chat.models import Conversation

from .models import Message
from .serializers import MessageSerializer, TranslateSerializer
from .schemas import list_message_docs
from .translator_service import translate_text
import openai

from communicator import settings

openai.api_key = settings.OPENAI_API_KEY


class MessageViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @list_message_docs
    def list(self, request):
        channel_id = request.query_params.get('channel_id')

        try:
            conversation = Conversation.objects.get(channel_id=channel_id)
            messages = conversation.message.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            return Response([], status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["POST"], url_path="reply_suggestions")
    def reply_suggestions(self, request, pk=None):
        try:
            message = Message.objects.get(id=pk)

            openai.api_key = settings.OPENAI_API_KEY

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system",
                     "content": "You are an assistant generating quick replies for a chat application."},
                    {"role": "user",
                     "content": f"The message to reply to is: '{message.content}'. Generate three short and relevant replies."}
                ],
                max_tokens=100,
                n=3
            )


            suggestions = [choice['message']['content'] for choice in response.choices]

            return Response(
                {"message_id": pk, "suggestions": suggestions},
                status=status.HTTP_200_OK
            )

        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)

        except OpenAIError as e:
            return Response({"error": f"AI service error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




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