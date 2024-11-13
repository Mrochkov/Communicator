import requests
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.types import OpenApiTypes
from rest_framework_simplejwt.authentication import JWTAuthentication


class ChatbotResponseView(APIView):
    """
    Endpoint to interact with the chatbot via Rasa.
    """
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    @extend_schema(
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string', 'description': 'Message to send to the bot', 'example': 'Hello!'},
                    'sender': {'type': 'string', 'description': 'Unique sender ID', 'example': 'user123'}
                },
                'required': ['message']
            }
        },
        responses={
            200: {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'recipient_id': {'type': 'string', 'description': 'Recipient ID'},
                        'text': {'type': 'string', 'description': 'Bot response text'}
                    }
                },
                'description': 'Successful response from the chatbot'
            },
            400: OpenApiTypes.OBJECT,
            500: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Successful Response',
                value=[
                    {'recipient_id': 'user123', 'text': 'Hello! How can I assist you today?'}
                ],
                response_only=True,
                status_codes=['200']
            ),
            OpenApiExample(
                'Message Required Error',
                value={"error": "Message is required."},
                response_only=True,
                status_codes=['400']
            ),
            OpenApiExample(
                'Server Error',
                value={"error": "Could not reach the Rasa server."},
                response_only=True,
                status_codes=['500']
            ),
        ],
        description="Send a message to the chatbot, and receive a response.",
        parameters=[
            OpenApiParameter(
                name="sender",
                description="Unique sender ID for the user (optional).",
                required=False,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name="message",
                description="Message to send to the bot (required).",
                required=True,
                type=OpenApiTypes.STR,
            ),
        ],
    )

    def post(self, request):

        message = request.data.get("message", "")
        sender_id = request.data.get("sender", "default")

        if not message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Forward the message to Rasa's REST API
        rasa_url = "http://localhost:5005/webhooks/rest/webhook"
        try:
            rasa_response = requests.post(
                rasa_url,
                json={"sender": sender_id, "message": message},
                timeout=5  # Set a timeout for the request
            )
            rasa_response.raise_for_status()  # Raise an error if the request failed
            return Response(rasa_response.json(), status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)