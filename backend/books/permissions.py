from rest_framework import permissions
from .models import LendingHistory


class LendingPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return (request.user.has_perm('books.view_all_lendings')
                or request.user.has_perm('books.view_own_lendings'))

    def has_object_permission(self, request, view, obj):
        return (request.user.has_perm('books.view_all_lendings')
                or request.user.has_perm('books.view_own_lendings')
                and obj.history.filter(
                    user=request.user, status=LendingHistory.RESERVED))


class LendingManagerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm('books.view_all_lendings')
