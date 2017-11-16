"""library URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib.auth.decorators import login_required
from django.contrib import admin
from django.conf import settings
from rest_framework import routers
from accounts.views import profile_view, login_view, logout_view, register_view, activate_view, edit_profile_view
from books.views import LendBookView, LendingUpdateView
from books.views import BookViewSet, LendingViewSet

admin.autodiscover()
admin.site.login = login_required(admin.site.login)

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'books', BookViewSet, base_name='book')
router.register(r'lendings', LendingViewSet, base_name='lending')

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/accounts/profile/edit', edit_profile_view),
    url(r'^api/accounts/profile', profile_view),
    url(r'^api/accounts/login', login_view),
    url(r'^api/accounts/logout', logout_view),
    url(r'^api/accounts/register', register_view),
    url(r'^api/accounts/activate/(?P<token>\w+)', activate_view),
    url(r'^api/lendings/(?P<id>\d+)/update', LendingUpdateView.as_view()),
    url(r'^api/books/(?P<id>\d+)/lend', LendBookView.as_view()),
    url(r'^api/', include(router.urls)),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
