from django.db import models
from django.utils import timezone

from accounts.models import User


class Tag(models.Model):
    text = models.CharField('tekst', max_length=50)


class Book(models.Model):
    title = models.CharField('tytuł', max_length=100)
    author = models.CharField('autor', max_length=100, blank=True, null=True)

    publication_year = models.PositiveSmallIntegerField(
        'rok wydania', blank=True, null=True)
    publication_place = models.CharField(
        'miejsce wydania', max_length=100, blank=True, null=True)
    publishing_house = models.CharField(
        'wydawnictwo', max_length=100, blank=True, null=True)

    count = models.PositiveSmallIntegerField('ilość', default=0)
    created = models.DateTimeField('utworzone', default=timezone.now)
    modified = models.DateTimeField('utworzone', default=timezone.now)

    description = models.TextField('opis', blank=True, null=True)
    file_name = models.CharField(
        'nazwa pliku', max_length=100, blank=True, null=True)
    tags = models.ManyToManyField(Tag, verbose_name='tagi')


class Lending(models.Model):
    book = models.ForeignKey(Book, verbose_name='książka')
    last_change = models.ForeignKey(
        'LendingHistory', verbose_name='ostatnia zmiana', related_name='+')

    class Meta:
        permissions = (
            ('view_own_lendings', 'Can view own lendings'),
            ('view_all_lendings', 'Can view all lendings'),
        )


class LendingHistory(models.Model):
    RESERVED = 1
    LENT = 2
    EXTENDED = 3
    RETURNED = 4
    CANCELLED = 5
    STATUSES = (
        (RESERVED, 'zarezerwowane'),
        (LENT, 'wypożyczone'),
        (EXTENDED, 'przedłużone'),
        (RETURNED, 'zwrócone'),
        (CANCELLED, 'anulowane'), )

    status = models.PositiveSmallIntegerField('status', choices=STATUSES)
    user = models.ForeignKey(User, verbose_name='użytkownik')
    lending = models.ForeignKey(Lending, verbose_name='wypożyczenie')
    created = models.DateTimeField('utworzone', default=timezone.now)
