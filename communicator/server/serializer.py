from rest_framework import serializers
from .models import Server, Category, Channel


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(serializers.ModelSerializer):
    channel_server = ChannelSerializer(many=True)
    members_num = serializers.SerializerMethodField()
    category = serializers.StringRelatedField()

    class Meta:
        model = Server
        exclude = ("member",)

    def get_members_num(self, obj):
        if hasattr(obj, "members_num"):
            return obj.members_num
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        members_num = self.context.get("members_num")
        if not members_num:
            data.pop("members_num", None)
        return data