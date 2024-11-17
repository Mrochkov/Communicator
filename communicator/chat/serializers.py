from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sender_id = serializers.StringRelatedField()
    content = serializers.StringRelatedField()
    timestamp = serializers.DateTimeField()
    # sender_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "sender_id", "sender_avatar", "content", "timestamp"]



class TranslateSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)
    to = serializers.CharField(max_length=10, default='pl')