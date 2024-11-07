from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Account
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, JWTCookieTokenRefreshSerializer, \
    SignUpSerializer, AccountSerializer
from .schemas import user_list_docs
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings

from django.contrib.auth.models import User

class SignUpView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            forbidden_usernames = ["admin", "superuser", "root"]
            if username is forbidden_usernames:
                return Response({"error": "This username is forbidden."}, status=status.HTTP_409_CONFLICT)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        errors = serializer.errors
        if "username" in errors and "non_field_errors" not in errors:
            return Response({"errors": "This username already exists"}, status=status.HTTP_409_CONFLICT)

        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request, format=None):
        response = Response("You have been logged out")

        response.set_cookie("refresh_token", "", expires=0)
        response.set_cookie("access_token", "", expires=0)

        return response

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
        if response.data.get("refresh"):
            response.set_cookie(
                settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"],
                response.data["refresh"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
        if response.data.get("access"):
            response.set_cookie(
                settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"],
                response.data["access"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
            del response.data["access"]
        # user_id = request.user.id
        # response.data["user_id"] = user_id



        return super().finalize_response(request, response, *args, **kwargs)


class JWTCookieTokenObtainPairView(JWTCookieMixin, TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class JWTCookieTokenRefreshView(JWTCookieMixin, TokenRefreshView):
    serializer_class = JWTCookieTokenRefreshSerializer


class AvatarUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        if 'avatar' in request.FILES:
            user.avatar = request.FILES['avatar']
            user.save()
            print(f'Avatar saved at {user.avatar.url}')

            return Response({'avatar': user.avatar.url}, status=status.HTTP_200_OK)
        return Response({'detail': 'No avatar uploaded.'}, status=status.HTTP_400_BAD_REQUEST)


class UserAvatarByIdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("User not found")

        avatar_url = user.account.avatar.url if user.account.avatar else None
        return Response({"avatar_url": avatar_url})