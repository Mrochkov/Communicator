from rest_framework import viewsets
from rest_framework.response import Response
from .models import Account
from .serializers import UserSerializer
from .schemas import user_list_docs
from rest_framework.permissions import IsAuthenticated


class UserViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    permission_classes = [IsAuthenticated]

    @user_list_docs
    def list(self, request):
        user_id = request.query_params.get('user_id')
        queryset = Account.objects.get(id=user_id)
        serializer = UserSerializer(queryset)
        return Response(serializer.data)
