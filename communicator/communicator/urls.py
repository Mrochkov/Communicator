"""
URL configuration for communicator project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularSwaggerView, SpectacularAPIView
from rest_framework.routers import DefaultRouter
from server.views import ServerListViewSet, CategoryListViewSet, MembershipViewSet, ChannelViewSet, ServerCreateView, UserServersView, validate_password
from django.conf import settings
from django.conf.urls.static import static
from chat.consumer import ChatConsumer
from chat.views import MessageViewSet, translate_view
from account.views import UserViewSet, JWTCookieTokenObtainPairView, JWTCookieTokenRefreshView, LogoutView, SignUpView, AvatarUpdateView, UserDetailView
from chatbot.views import ChatbotResponseView


router = DefaultRouter()
router.register("api/server/select", ServerListViewSet)
router.register("api/server/category", CategoryListViewSet)
router.register("api/messages", MessageViewSet, basename="message")
router.register("api/user", UserViewSet, basename="user")
router.register(r"api/membership/(?P<server_id>\d+)/membership", MembershipViewSet, basename='membership')
router.register(r"api/server/(?P<server_id>\d+)/channels", ChannelViewSet, basename='channels')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/docs/schema/', SpectacularAPIView.as_view(), name="schema"),
    path('api/docs/schema/ui/', SpectacularSwaggerView.as_view()),
    path('api/token/', JWTCookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', JWTCookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/signup/', SignUpView.as_view(), name='signup'),
    path('api/server/create/', ServerCreateView.as_view(), name='server-create'),
    path('api/user/servers/', UserServersView.as_view(), name='user_servers'),
    path('user/avatar/<int:user_id>/', AvatarUpdateView.as_view(), name='avatar-update'),
    path('user/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
    path('translate/', translate_view, name='translate'),
    path('chatbot/response/', ChatbotResponseView.as_view(), name="chatbot-response"),
    path('server/<int:server_id>/validate_password/', validate_password, name='validate_password'),
] + router.urls

websocket_urlpatterns = [path("<str:serverId>/<str:channelId>", ChatConsumer.as_asgi())]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)