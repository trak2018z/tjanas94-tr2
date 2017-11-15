from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.cache import never_cache
from django.views.decorators.debug import sensitive_variables
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.core.cache import cache
from django.template import loader
from django.http.response import HttpResponseRedirect
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
import uuid

from .models import User, Group
from .utils import check_captcha


@ensure_csrf_cookie
@never_cache
@api_view(['GET'])
@permission_classes([AllowAny])
def profile_view(request):
    if request.user.is_authenticated:
        return Response({
            'user': {
                'email': request.user.email,
                'firstname': request.user.first_name,
                'lastname': request.user.last_name,
                'admin': request.user.is_superuser,
                'permissions': request.user.get_all_permissions(),
            }
        })

    return Response({'detail': 'Nie jesteś zalogowany'})


@sensitive_variables()
@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
            'user': {
                'email': user.email,
                'firstname': user.first_name,
                'lastname': user.last_name,
                'admin': user.is_superuser,
                'permissions': user.get_all_permissions(),
            }
        })

    return Response({'detail': 'Nieprawidłowe dane logowania'}, status=401)


@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=204)


@csrf_protect
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    if not check_captcha(request.data.get('captcha', '')):
        return Response({'detail': 'Nieprawidłowy wynik captchy'}, status=400)

    group = Group.objects.get_by_natural_key('czytelnicy')
    user = User(
        email=request.data.get('email', ''),
        first_name=request.data.get('firstname', ''),
        last_name=request.data.get('lastname', ''),
        is_active=False,
        group=group)
    user.set_password(request.data.get('password', ''))

    try:
        user.clean_fields()
        user.clean()
    except ValidationError as e:
        return Response(
            {
                'detail': 'Dane użytkownika są błędne',
                'validation': e
            },
            status=400)

    try:
        user.validate_unique()
    except ValidationError as e:
        return Response({'detail': 'Adres email jest zajęty'}, status=400)

    user.save()
    token = uuid.uuid4().hex
    cache.set(f'activation:{token}', user.id, timeout=24 * 60 * 60)
    link = request.build_absolute_uri('/').strip(
        "/") + '/api/accounts/activate/' + token

    template = loader.get_template('accounts/email_activation.html')
    context = {
        'firstname': user.first_name,
        'link': link,
    }
    html = template.render(context, request)
    user.email_user('Aktywacja konta w bibliotece', html, html_message=html)

    return Response(status=204)


@api_view(['GET'])
@permission_classes([AllowAny])
def activate_view(request, token):
    userId = cache.get(f'activation:{token}')
    response = HttpResponseRedirect('/login')
    if userId is None:
        response.set_cookie('message', 'invalid_token')
        return response

    try:
        user = User.objects.get(pk=userId)
    except User.DoesNotExist:
        response.set_cookie('message', 'invalid_token')
        return response

    user.activation_date = timezone.now()
    user.is_active = True
    user.save()
    cache.delete(f'activation:{token}')

    response.set_cookie('message', 'activation_success')
    return response
