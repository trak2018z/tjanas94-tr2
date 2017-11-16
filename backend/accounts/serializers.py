from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    admin = serializers.SerializerMethodField('is_admin')
    permissions = serializers.SerializerMethodField()

    def is_admin(self, obj):
        return obj.is_superuser

    def get_permissions(self, obj):
        return obj.get_all_permissions()

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'date_joined', 'admin',
                  'permissions')


class LendingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')
