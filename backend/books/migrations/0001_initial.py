# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-22 14:15
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='tytuł')),
                ('author', models.CharField(blank=True, max_length=100, null=True, verbose_name='autor')),
                ('publication_year', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='rok wydania')),
                ('publication_place', models.CharField(blank=True, max_length=100, null=True, verbose_name='miejsce wydania')),
                ('publishing_house', models.CharField(blank=True, max_length=100, null=True, verbose_name='wydawnictwo')),
                ('count', models.PositiveSmallIntegerField(default=0, verbose_name='ilość')),
                ('created', models.DateField(default=django.utils.timezone.now, verbose_name='utworzone')),
                ('modified', models.DateField(default=django.utils.timezone.now, verbose_name='utworzone')),
                ('description', models.TextField(blank=True, null=True, verbose_name='opis')),
                ('file_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='nazwa pliku')),
            ],
        ),
        migrations.CreateModel(
            name='Lending',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='books.Book', verbose_name='książka')),
            ],
        ),
        migrations.CreateModel(
            name='LendingHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.PositiveSmallIntegerField(choices=[(1, 'zarezerwowane'), (2, 'wypożyczone'), (3, 'przedłużone'), (4, 'zwrócone'), (5, 'anulowane')], verbose_name='status')),
                ('created', models.DateField(default=django.utils.timezone.now, verbose_name='utworzone')),
                ('lending', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='books.Lending', verbose_name='wypożyczenie')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='użytkownik')),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=50, verbose_name='tekst')),
            ],
        ),
        migrations.AddField(
            model_name='lending',
            name='last_change',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='books.LendingHistory', verbose_name='ostatnia zmiana'),
        ),
        migrations.AddField(
            model_name='book',
            name='tags',
            field=models.ManyToManyField(to='books.Tag', verbose_name='tagi'),
        ),
    ]