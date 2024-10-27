from django.shortcuts import render
from rest_framework import viewsets
from .serializer import ServerSerializer, CategorySerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from .schema import server_list_docs

from .models import Server, Category
from drf_spectacular.utils import extend_schema


class CategoryListViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    # permission_classes = [IsAuthenticated]

    @server_list_docs
    def list(self, request):
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_server_id = request.query_params.get("by_server_id")
        with_members_num = request.query_params.get("with_members_num") == "true"

        # if by_user or by_server_id and not request.user.is_authentificated:
        #    raise AuthenticationFailed()

        if category:
            self.queryset= self.queryset.filter(category__name=category)

        if by_user:
            if by_user and request.user.is_authenticated:
                user_id = request.user.id
                self.queryset = self.queryset.filter(member=user_id)
            else:
                raise AuthenticationFailed()

        if by_server_id:
            # if by_user and request.user.is_authenticated:
                # raise AuthenticationFailed()
            try:
                self.queryset = self.queryset.filter(id=by_server_id)
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server with id {by_server_id} not found")
            except ValueError:
                raise ValidationError(detail="Server value error")

        if with_members_num:
            self.queryset = self.queryset.annotate(members_num=Count("member"))

        if qty:
            self.queryset = self.queryset[: int(qty)]

        serializer = ServerSerializer(self.queryset, many=True, context={"members_num": with_members_num})

        return Response(serializer.data)
