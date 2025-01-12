from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sender = serializers.StringRelatedField()
    content = serializers.StringRelatedField()
    timestamp = serializers.DateTimeField()
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_avatar = serializers.ImageField(source='sender.avatar', required=False)
    reply_to = serializers.SerializerMethodField()
    sender_language = serializers.CharField(source='sender.language', read_only=True)
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = ["id", "sender", "sender_username", "sender_avatar", "content", "image_url", "timestamp", "reply_to", "sender_language",]

    def get_reply_to(self, obj):
        if obj.reply_to:
            return {
                "id": obj.reply_to.id,
                "sender": obj.reply_to.sender.username,
                "content": obj.reply_to.content,
                "timestamp": obj.reply_to.timestamp,
            }
        return None

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class TranslateSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)
    to = serializers.CharField(max_length=10)