from django.db import models
from django.contrib import auth
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    Group,
    Permission, )
from django.utils import timezone
from django.core.mail import send_mail
from django.utils.translation import ugettext_lazy as _
from django.conf import settings


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Adres email jest wymagany')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        now = timezone.now()
        return self._create_user(
            email,
            password,
            is_superuser=True,
            activation_date=now,
            is_active=True,
            **extra_fields)


class User(AbstractBaseUser):
    """
    Users within the Django authentication system are represented by this
    model.
    Password and email are required. Other fields are optional.
    """

    first_name = models.CharField(_('first name'), max_length=30)
    last_name = models.CharField(_('last name'), max_length=30)
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': "Użytkownik o tym adresie już istnieje",
        }, )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'), )
    is_superuser = models.BooleanField(
        _('superuser status'),
        default=False,
        help_text=_('Designates that this user has all permissions without '
                    'explicitly assigning them.'), )
    group = models.ForeignKey(
        Group,
        verbose_name='grupa',
        null=True,
        blank=True,
        help_text='Grupa do której należy użytkownik.', )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    last_password_change = models.DateTimeField(
        'data ostatniej zmiany hasła',
        default=timezone.now,
        null=True,
        blank=True)
    activation_date = models.DateTimeField(
        'data aktywacji', null=True, blank=True)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def clean(self):
        super(AbstractBaseUser, self).clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def email_user(self,
                   subject,
                   message,
                   from_email=settings.EMAIL_HOST_USER,
                   **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_superuser

    def get_all_permissions(self, obj=None):
        if not hasattr(self, '_perm_cache'):
            if self.is_superuser:
                perms = Permission.objects
            else:
                perms = self.group.permissions
            perms = perms.all()\
                .values_list('content_type__app_label', 'codename')\
                .order_by()
            self._perm_cache = {f'{model}.{perm}' for model, perm in perms}
        return self._perm_cache

    def has_perm(self, perm, obj=None):
        if not self.is_active:
            return False

        if self.is_superuser:
            return True

        return perm in self.get_all_permissions()

    def has_perms(self, perm_list, obj=None):
        return all(self.has_perm(perm, obj) for perm in perm_list)

    def has_module_perms(self, app_label):
        if not self.is_active:
            return False

        if self.is_superuser:
            return True

        return any(
            perm.startswith(app_label + '.')
            for perm in self.get_all_permissions())


class PasswordHistory(models.Model):
    password = models.CharField('hasło', max_length=128)
    created = models.DateTimeField('utworzone', default=timezone.now)
    user = models.ForeignKey(User, verbose_name='użytkownik')
