from rest_framework import viewsets
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from django.db import models
from django_filters import rest_framework as filters
from .serializers import BookSerializer
from .models import Book


class BookFilter(filters.FilterSet):
    available = filters.BooleanFilter(method='is_available')

    def is_available(self, queryset, name, value):
        if value:
            return queryset.filter(count__gt=0)
        else:
            return queryset.filter(count__lte=0)

    class Meta:
        model = Book
        fields = {
            'title': ['exact'],
            'author': ['exact'],
            'publication_year': ['gte', 'lte'],
            'available': ['exact'],
        }
        filter_overrides = {
            models.CharField: {
                'filter_class': filters.CharFilter,
                'extra': lambda f: {
                    'lookup_expr': 'icontains', },
            }
        }


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-modified')
    serializer_class = BookSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filter_class = BookFilter
