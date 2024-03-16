from django.shortcuts import render
from rest_framework import viewsets
from .serializer import ServerSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, AuthenticationFailed



from .models import Server


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()

    def list(self, request):
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_server_id = qty = request.query_params.get("by_server_id")

        if by_user or by_server_id and not request.user.is_authentificated:
            raise AuthenticationFailed()

        if category:
            self.queryset= self.queryset.filter(category__name=category)

        if by_user:
            user_id = request.user.id
            self.queryset = self.queryset.filter(member=user_id)

        if by_server_id:
            try:
                self.queryset = self.queryset.filter(id=by_server_id)
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server with id {by_server_id} not found")
            except ValueError:
                raise ValidationError(detail="Server value error")

        if qty:
            self.queryset = self.queryset[: int(qty)]


        serializer = ServerSerializer(self.queryset, many=True)
        return Response(serializer.data)