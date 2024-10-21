"""
ASGI config for communicator project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'communicator.settings')

django_application = get_asgi_application()

from . import urls # noqa isort:skip
from chat.middleware import ChatMiddleware # noqa isort:skip

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": ChatMiddleware(URLRouter(urls.websocket_urlpatterns)),

    }
)