import requests
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView

from .serializer import ServerSerializer, CategorySerializer, ChannelSerializer, ServerCreateSerializer, \
    PasswordValidationSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count
from .schema import server_list_docs
from rest_framework.decorators import action, api_view, permission_classes
from .models import Server, Category, Channel
from drf_spectacular.utils import extend_schema, OpenApiExample
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import logging

from communicator import settings
from account.models import Account

from chat.consumer import User


class MembershipViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, server_id):
        server = get_object_or_404(Server, id=server_id)
        user = request.user
        password = request.data.get('password', '')

        # if server.private:
        #     if server.password != password:
        #         return Response({"error": "Incorrect password"}, status=status.HTTP_403_FORBIDDEN)

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

    @action(detail=False, methods=["POST"], url_path="remove_member_from_server/(?P<user_id>\d+)")
    def remove_member_from_server(self, request, server_id=None, user_id=None):
        server = get_object_or_404(Server, id=server_id)
        user_to_remove = get_object_or_404(User, id=user_id)

        if not server.member.filter(id=user_to_remove.id).exists():
            return Response({"error": "User is not a member of this server"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user != server.owner:
            return Response({"error": "You are not authorized to remove members from this server"},
                            status=status.HTTP_403_FORBIDDEN)

        if request.user == user_to_remove:
            return Response({"error": "The server owner cannot remove themselves from the server"},
                            status=status.HTTP_403_FORBIDDEN)

        server.member.remove(user_to_remove)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"server_{server_id}",
            {
                "type": "update_membership",
                "user_id": user_to_remove.id,
                "is_member": False
            }
        )

        return Response({"message": "User has been removed from the server"}, status=status.HTTP_200_OK)


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
        search = request.query_params.get("search")
        sort = request.query_params.get("sort")

        if category:
            self.queryset = self.queryset.filter(category__name=category)

        if search:
            self.queryset = self.queryset.filter(name__icontains=search)

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

        if sort:
            if sort == "asc":
                self.queryset = self.queryset.order_by("members_num")
            elif sort == "desc":
                self.queryset = self.queryset.order_by("-members_num")

        self.queryset = self.queryset.prefetch_related("member")

        if qty:
            self.queryset = self.queryset[: int(qty)]

        serializer = ServerSerializer(self.queryset, many=True, context={"members_num": with_members_num})

        return Response(serializer.data)


    @action(detail=True, methods=['PATCH'])
    def edit_details(self, request, pk=None):
        server = get_object_or_404(Server, id=pk)
        if request.user != server.owner:
            return Response({'error': 'Only the owner can edit server details.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ServerCreateSerializer(server, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['DELETE'])
    def delete(self, request, pk=None):
        server = get_object_or_404(Server, id=pk)
        if request.user != server.owner:
            return Response({'error': 'Only the owner can delete the server.'}, status=status.HTTP_403_FORBIDDEN)

        server.delete()
        return Response({'message': 'Server deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

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

    def partial_update(self, request, pk=None, server_id=None):
        channel = get_object_or_404(Channel, id=pk, server_id=server_id)
        if request.user != channel.owner:
            return Response({'error': 'Only the channel owner can edit the channel.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ChannelSerializer(channel, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None, server_id=None):
        channel = get_object_or_404(Channel, id=pk, server_id=server_id)
        if request.user != channel.owner:
            return Response({'error': 'Only the channel owner can delete the channel.'},
                            status=status.HTTP_403_FORBIDDEN)

        channel.delete()
        return Response({'message': 'Channel deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

class ServerCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Server.objects.all()
    serializer_class = ServerCreateSerializer


class UserServersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"Request from user: {request.user}")
        user = request.user
        servers = user.servers.all()
        return Response([server.serialize() for server in servers])

@extend_schema(
    request=PasswordValidationSerializer,
    responses={
        200: OpenApiExample(
            name="Valid password",
            value={"valid": True, "message": "Password is valid"}
        ),
        400: OpenApiExample(
            name="Invalid password",
            value={"valid": False, "message": "Incorrect password"}
        ),
    },
    examples=[
        OpenApiExample(
            name="Valid request",
            value={"password": "correct_password"}
        ),
        OpenApiExample(
            name="Invalid request",
            value={"password": "incorrect_password"}
        )
    ]
)
@permission_classes([AllowAny])
@api_view(['POST'])
def validate_password(request, server_id):
    try:
        server = Server.objects.get(id=server_id)
    except Server.DoesNotExist:
        return Response({'error': 'Server not found'}, status=status.HTTP_404_NOT_FOUND)

    password = request.data.get('password')

    if password is None:
        return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

    if server.private and password == server.password:
        return Response({'valid': True}, status=status.HTTP_200_OK)

    return Response({'valid': False, 'message': 'Incorrect password'}, status=status.HTTP_400_BAD_REQUEST)