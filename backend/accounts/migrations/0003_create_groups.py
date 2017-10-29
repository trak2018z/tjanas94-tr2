from django.db import models, migrations


def apply_migration(apps, schema_editor):
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
    ]

    operations = [migrations.RunPython(apply_migration, revert_migration)]
