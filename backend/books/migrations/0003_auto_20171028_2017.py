# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-28 18:17
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0002_auto_20171023_2247'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lending',
            options={'permissions': (('view_own_lendings', 'Can view own lendings'), ('view_all_lendings', 'Can view all lendings'))},
        ),
    ]
