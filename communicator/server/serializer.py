from rest_framework import serializers
from .models import Server, Category, Channel
from account.serializers import UserSerializer  # Absolute import of UserSerializer

from account.models import Account


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name']


class ServerSerializer(serializers.ModelSerializer):
    member = UserSerializer(many=True, read_only=True)

    channel_server = ChannelSerializer(many=True)
    members_num = serializers.SerializerMethodField()
    category = serializers.StringRelatedField()

    class Meta:
        model = Server
        fields = ['id', 'name', 'category', 'icon', 'banner', 'member', 'channel_server', 'members_num']

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


class ServerCreateSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    icon = serializers.ImageField(required=False)
    banner = serializers.ImageField(required=False)
    class Meta:
        model = Server
        fields = ['name', 'owner', 'category', 'description', 'icon', 'banner']
        extra_kwargs = {
            'icon': {'required': False},
            'banner': {'required': False},
            'description': {'required': False},
        }

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['owner'] = user

        server = Server.objects.create(**validated_data)
        return server