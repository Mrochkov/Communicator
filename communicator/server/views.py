import requests
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView

from .serializer import ServerSerializer, CategorySerializer, ChannelSerializer, ServerCreateSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count
from .schema import server_list_docs
from rest_framework.decorators import action, api_view
from .models import Server, Category, Channel
from drf_spectacular.utils import extend_schema, OpenApiExample
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import logging

class MembershipViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, server_id):
        server = get_object_or_404(Server, id=server_id)
        user = request.user
        if server.member.filter(id=user.id).exists():
            return Response({"error": "User is already a member"}, status=status.HTTP_409_CONFLICT)

        server.member.add(user)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"server_{server_id}",
            {
                "type": "update_membership",
                "user_id": user.id,
                "is_member": True
            }
        )

        return Response({"message": "You have joined successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["DELETE"])
    def remove_member(self, request, server_id):
        server = get_object_or_404(Server, id=server_id)
        user = request.user
        if not server.member.filter(id=user.id).exists():
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if server.owner == user:
            return Response({"error": "Owner cannot leave the server"}, status=status.HTTP_409_CONFLICT)

        server.member.remove(user)
        return Response({"message": "User was removed from the server"}, status=status.HTTP_200_OK)


    @action(detail=False, methods=["GET"])
    def is_member(self, request, server_id=None):
        server = get_object_or_404(Server, id=server_id)
        user = request.user
        is_member = server.member.filter(id=user.id).exists()
        return Response({"is_member": is_member})


class CategoryListViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()
    permission_classes = [IsAuthenticated]
    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    permission_classes = [IsAuthenticated]
    @server_list_docs
    def list(self, request):
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_server_id = request.query_params.get("by_server_id")
        with_members_num = request.query_params.get("with_members_num") == "true"

        if category:
            self.queryset = self.queryset.filter(category__name=category)

        if by_user and request.user.is_authenticated:
            user_id = request.user.id
            self.queryset = self.queryset.filter(member=user_id)

        if by_server_id:
            try:
                self.queryset = self.queryset.filter(id=by_server_id)
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server with id {by_server_id} not found")
            except ValueError:
                raise ValidationError(detail="Server value error")

        if with_members_num:
            self.queryset = self.queryset.annotate(members_num=Count("member"))

        self.queryset = self.queryset.prefetch_related("member")

        if qty:
            self.queryset = self.queryset[: int(qty)]

        serializer = ServerSerializer(self.queryset, many=True, context={"members_num": with_members_num})

        return Response(serializer.data)


class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        server_id = self.kwargs['server_id']
        return Channel.objects.filter(server_id=server_id)

    def create(self, request, server_id=None):
        server = get_object_or_404(Server, id=server_id)

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        channel = serializer.save(server=server, owner=request.user)

        return Response(ChannelSerializer(channel).data, status=status.HTTP_201_CREATED)


class ServerCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Server.objects.all()
    serializer_class = ServerCreateSerializer


class UserServersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"Request from user: {request.user}")
        user = request.user
        servers = user.servers.all()
        return Response([server.serialize() for server in servers])

