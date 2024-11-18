from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sender_id = serializers.StringRelatedField()
    content = serializers.StringRelatedField()
    timestamp = serializers.DateTimeField()
    sender_username = serializers.CharField(source='sender_id.username', read_only=True)
    sender_avatar = serializers.ImageField(source='sender_id.avatar', required=False)

    class Meta:
        model = Message
        fields = ["id", "sender_id", "sender_username", "sender_avatar", "content", "timestamp"]



class TranslateSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)
    to = serializers.CharField(max_length=10, default='pl')