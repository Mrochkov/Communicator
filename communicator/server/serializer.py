from rest_framework import serializers
from .models import Server, Category, Channel
from account.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name']


class ServerSerializer(serializers.ModelSerializer):
    member = UserSerializer(many=True, read_only=True)  # This will list connected members
    channel_server = ChannelSerializer(many=True)
    members_num = serializers.SerializerMethodField()
    category = serializers.StringRelatedField()

    class Meta:
        model = Server
        fields = ['id', 'name', 'category', 'icon', 'banner', 'member', 'channel_server', 'members_num']

    def get_members_num(self, obj):
        # If annotated, return the number of members
        if hasattr(obj, "members_num"):
            return obj.members_num
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        members_num = self.context.get("members_num")
        if not members_num:
            data.pop("members_num", None)  # Remove members_num if it's not requested
        return data