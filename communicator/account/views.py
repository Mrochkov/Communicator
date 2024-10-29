from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Account
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, JWTCookieTokenRefreshSerializer, SignUpSerializer
from .schemas import user_list_docs
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings

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