"""
WSGI config for biblioteka project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "biblioteka.settings")

if settings.ENABLE_PTVSD:
    import ptvsd
    ptvsd.enable_attach(settings.PTVSD_SECRET, address=('0.0.0.0', 3000))

application = get_wsgi_application()
