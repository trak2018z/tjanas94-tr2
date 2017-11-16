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
from .serializers import UserSerializer


@ensure_csrf_cookie
@never_cache
@api_view(['GET'])
@permission_classes([AllowAny])
def profile_view(request):
    if request.user.is_authenticated:
        return Response({'user': UserSerializer(request.user).data})

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
        return Response({'user': UserSerializer(user).data})

    return Response({'detail': 'Nieprawidłowe dane logowania'}, status=401)


@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response(status=204)


@sensitive_variables()
@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    if not check_captcha(request.data.get('captcha', '')):
        return Response({'detail': 'Nieprawidłowy wynik captchy'}, status=400)

    group = Group.objects.get_by_natural_key('czytelnicy')
    user = User(
        email=request.data.get('email', ''),
        first_name=request.data.get('first_name', ''),
        last_name=request.data.get('last_name', ''),
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
        'first_name': user.first_name,
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


@sensitive_variables()
@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_profile_view(request):
    try:
        user = User.objects.get(pk=request.user.id)
    except User.DoesNotExist:
        return Response(
            {
                'detail': 'Użytkownik nie istnieje',
            }, status=404)

    if not user.check_password(request.data.get('old_password', '')):
        return Response(
            {
                'detail': 'Nieprawidłowe hasło',
            }, status=400)

    user.email = request.data.get('email', '')
    user.first_name = request.data.get('first_name', '')
    user.last_name = request.data.get('last_name', '')
    if request.data.get('password'):
        user.set_password(request.data.get('password'))

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
    login(request, user)

    return Response({'user': UserSerializer(user).data})


@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_step1(request):
    if not check_captcha(request.data.get('captcha', '')):
        return Response({'detail': 'Nieprawidłowy wynik captchy'}, status=400)

    try:
        user = User.objects.get_by_natural_key(
            request.data.get('email', ''))
    except User.DoesNotExist:
        return Response(
            {
                'detail': 'Użytkownik nie istnieje',
            }, status=404)

    token = uuid.uuid4().hex
    cache.set(f'reset_password:{token}', user.id, timeout=24 * 60 * 60)
    link = request.build_absolute_uri('/').strip(
        "/") + '/reset_password/' + token

    template = loader.get_template('accounts/email_reset_password.html')
    context = {
        'first_name': user.first_name,
        'link': link,
    }
    html = template.render(context, request)
    user.email_user('Reset hasła w bibliotece', html, html_message=html)

    return Response(status=204)


@sensitive_variables()
@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_step2(request):
    token = request.data.get("token", "")
    userId = cache.get(f'reset_password:{token}')
    if userId is None:
        return Response(
            {
                'detail': 'Nieprawidłowy token',
            }, status=400)

    try:
        user = User.objects.get(pk=userId)
    except User.DoesNotExist:
        return Response(
            {
                'detail': 'Nieprawidłowy token',
            }, status=400)

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

    user.save()
    cache.delete(f'reset_password:{token}')

    return Response(status=204)
