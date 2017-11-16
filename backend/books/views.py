from rest_framework import viewsets
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from django.core.exceptions import PermissionDenied
from django.db import models
from django.db.models import F, Count, OuterRef, Subquery, ExpressionWrapper, Value as V
from django.db.models.functions import Coalesce
from django.db import transaction
from django_filters import rest_framework as filters
from datetime import date
import django_excel as excel
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import BookSerializer, LendingSerializer
from .models import Book, Lending, LendingHistory
from .permissions import LendingPermission, LendingManagerPermission


class BookFilter(filters.FilterSet):
    available = filters.BooleanFilter(method='is_available')

    def is_available(self, queryset, name, value):
        if value:
            return queryset.filter(available__gt=0)
        else:
            return queryset.filter(available__lte=0)

    class Meta:
        model = Book
        fields = {
            'title': ['exact'],
            'author': ['exact'],
            'publication_year': ['gte', 'lte'],
        }
        filter_overrides = {
            models.CharField: {
                'filter_class': filters.CharFilter,
                'extra': lambda f: {
                    'lookup_expr': 'icontains', },
            }
        }


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    filter_class = BookFilter

    def get_queryset(self):
        lendings = Lending.objects.filter(
            book=OuterRef('pk'),
            last_change__status__in=[
                LendingHistory.RESERVED, LendingHistory.LENT,
                LendingHistory.EXTENDED
            ]).values('book').annotate(total=Count('pk')).values('total')

        return Book.objects.all().order_by('-modified')\
            .annotate(available=ExpressionWrapper(
                F('count') - Coalesce(Subquery(lendings), V(0)),
                output_field=models.PositiveSmallIntegerField()))


class LendingFilter(filters.FilterSet):
    status = filters.NumberFilter(method='get_status')
    user = filters.CharFilter(method='get_user')
    created__gte = filters.NumberFilter(method='get_created_gte')
    created__lte = filters.NumberFilter(method='get_created_lte')

    def get_status(self, queryset, name, value):
        return queryset.filter(last_change__status=value)

    def get_user(self, queryset, name, value):
        return queryset.filter(
            history__user__email=value,
            history__status=LendingHistory.RESERVED)

    def get_created_gte(self, queryset, name, value):
        return queryset.filter(
            history__created__gte=date.fromtimestamp(value),
            history__status=LendingHistory.RESERVED)

    def get_created_lte(self, queryset, name, value):
        return queryset.filter(
            history__created__lt=date.fromtimestamp(value + 86400),
            history__status=LendingHistory.RESERVED)

    class Meta:
        model = Lending
        fields = []


class LendingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LendingSerializer
    permission_classes = [LendingPermission]
    filter_class = LendingFilter

    def get_queryset(self):
        if self.request.user.has_perm('books.view_all_lendings'):
            return Lending.objects.all().order_by('-last_change__created')

        return Lending.objects.filter(
            history__user=self.request.user,
            history__status=LendingHistory.RESERVED).order_by(
                '-last_change__created')


class LendBookView(APIView):
    permission_classes = (LendingPermission, )

    def post(self, request, id):
        try:
            book = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(
                data={'detail': 'Książka nie istnieje'}, status=404)

        if not book.is_available():
            return Response(
                data={'detail': 'Książka jest niedostępna'}, status=400)

        with transaction.atomic():
            lending = Lending.objects.create(book=book)
            lending.last_change = LendingHistory.objects.create(
                lending=lending,
                user=request.user,
                status=LendingHistory.RESERVED)
            lending.save()

        return Response(status=204)


class LendingUpdateView(APIView):
    status_changes = {
        LendingHistory.RESERVED: {
            'allowed_statuses': (LendingHistory.LENT,
                                 LendingHistory.CANCELLED),
            'detail': 'Rezerwację można wypożyczyć lub anulować',
        },
        LendingHistory.LENT: {
            'allowed_statuses': (LendingHistory.EXTENDED,
                                 LendingHistory.RETURNED),
            'detail':
            'Wypożyczenie można przedłużyć lub zwrócić',
        },
        LendingHistory.EXTENDED: {
            'allowed_statuses': (LendingHistory.RETURNED, ),
            'detail': 'Przedłużone wypożyczenie można zwrócić',
        },
        LendingHistory.RETURNED: {
            'allowed_statuses': (),
            'detail': 'Wypożyczenie jest zwrócone',
        },
        LendingHistory.CANCELLED: {
            'allowed_statuses': (),
            'detail': 'Rezerwacja jest anulowana',
        },
        'default': {
            'allowed_statuses': (),
            'detail': 'Nieprawidłowy status',
        },
    }

    def get_permissions(self):
        if self.request.data.get('status') == LendingHistory.CANCELLED:
            return (LendingPermission(), )
        else:
            return (LendingManagerPermission(), )

    def post(self, request, id):
        try:
            lending = Lending.objects.get(pk=id)
            self.check_object_permissions(request, lending)
        except (Lending.DoesNotExist, PermissionDenied):
            return Response(
                data={'detail': 'Wypożyczenie nie istnieje'}, status=404)

        change = self.status_changes.get(lending.last_change.status,
                                         self.status_changes['default'])
        if request.data.get('status') not in change['allowed_statuses']:
            return Response(data={'detail': change}, status=400)

        with transaction.atomic():
            lending.last_change = LendingHistory.objects.create(
                lending=lending,
                user=request.user,
                status=request.data.get('status'))
            lending.save()

        return Response(status=204)


class LendingExportView(APIView):
    permission_classes = (LendingManagerPermission, )

    def get(self, request):
        lendings = LendingFilter(
            request.GET, queryset=Lending.objects.all()).qs
        if not lendings:
            return Response(status=204)

        to_export = [[
            'id książki',
            'tytuł ksiązki',
            'utworzone przez',
            'status',
            'data utworzenia',
            'data modyfikacji',
        ]]
        for lending in lendings:
            first_history_entry = lending.history.filter(
                status=LendingHistory.RESERVED).first()
            to_export.append([
                lending.book.id,
                lending.book.title,
                first_history_entry.user.email,
                LendingHistory.STATUSES_MAP[lending.last_change.status],
                first_history_entry.created,
                lending.last_change.created,
            ])

        return excel.make_response_from_array(
            to_export, 'xlsx', file_name='lendings.xlsx')
