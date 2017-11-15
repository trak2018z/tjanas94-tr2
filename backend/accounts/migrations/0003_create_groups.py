from django.db import migrations
from django.contrib.auth.management import create_permissions


def apply_migration(apps, schema_editor):
    for app_config in apps.get_app_configs():
        app_config.models_module = True
        create_permissions(app_config, apps=apps, verbosity=0)
        app_config.models_module = None

    Group = apps.get_model('auth', 'Group')
    Permission = apps.get_model('auth', 'Permission')
    (group1, group2) = Group.objects.bulk_create([
        Group(name='czytelnicy'),
        Group(name='pracownicy'),
    ])

    group1.permissions.add(
        *list(Permission.objects.filter(codename__in=[
            'view_own_lendings',
        ]))
    )

    group2.permissions.add(
        *list(Permission.objects.filter(codename__in=[
            'add_book',
            'change_book',
            'delete_book',
            'view_all_lendings',
        ]))
    )


def revert_migration(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.filter(name__in=[
        'czytelnicy',
        'pracownicy',
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_user_activation_date'),
        ('books', '0003_auto_20171028_2017'),
    ]

    operations = [migrations.RunPython(apply_migration, revert_migration)]
