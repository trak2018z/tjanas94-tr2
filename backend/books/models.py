from django.db import models
from django.utils import timezone
from django.db.models.signals import pre_save
from django.dispatch import receiver

from accounts.models import User


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

    def is_available(self):
        return self.count - self.lending_set.filter(last_change__status__in=[
            LendingHistory.RESERVED, LendingHistory.LENT,
            LendingHistory.EXTENDED
        ]).count() > 0


class Lending(models.Model):
    book = models.ForeignKey(
        Book,
        verbose_name='książka',
        on_delete=models.CASCADE, )
    last_change = models.ForeignKey(
        'LendingHistory',
        verbose_name='ostatnia zmiana',
        related_name='+',
        null=True,
        on_delete=models.CASCADE, )

    class Meta:
        permissions = (
            ('view_own_lendings', 'Can view own lendings'),
            ('view_all_lendings', 'Can view all lendings'), )


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
    STATUSES_MAP = {k: v for k, v in STATUSES}

    status = models.PositiveSmallIntegerField('status', choices=STATUSES)
    user = models.ForeignKey(
        User,
        verbose_name='użytkownik',
        on_delete=models.CASCADE, )
    lending = models.ForeignKey(
        Lending,
        verbose_name='wypożyczenie',
        related_name='history',
        on_delete=models.CASCADE, )
    created = models.DateTimeField('utworzone', default=timezone.now)


@receiver(pre_save, sender=Book)
def book_modified(sender, instance, **kwargs):
    instance.modified = timezone.now()
