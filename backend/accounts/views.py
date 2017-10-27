from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.cache import never_cache
from django.views.decorators.debug import sensitive_variables
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated


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

    return Response(status=401)


@sensitive_variables()
@csrf_protect
@never_cache
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data['username']
    password = request.data['password']
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
