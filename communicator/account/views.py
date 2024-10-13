from rest_framework import viewsets
from rest_framework.response import Response
from .models import Account
from .serializers import UserSerializer
from .schemas import user_list_docs
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class UserViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    permission_classes = [IsAuthenticated]

    @user_list_docs
    def list(self, request):
        user_id = request.query_params.get('user_id')
        queryset = Account.objects.get(id=user_id)
        serializer = UserSerializer(queryset)
        return Response(serializer.data)

class JWTCookieMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        token = response.data.get('refresh')
        print(token)
        return super().finalize_response(request, response, *args, **kwargs)


class JWTCookieTokenObtainPairView(JWTCookieMixin, TokenObtainPairView):
    pass