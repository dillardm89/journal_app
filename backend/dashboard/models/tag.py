import uuid
from django.db import models
from django.core.validators import (MinLengthValidator, MaxLengthValidator)
from login.models.custom import CustomDateTimeField
from login.models.user import User


class Tag(models.Model):
    ''' Tag: custom Tag model associated to
            User model by foreign key

        Args:
            Model (class): Django generic model class
    '''
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, blank=False, null=False,
                             on_delete=models.CASCADE,
                             related_name='tags')
    name = models.CharField(
        max_length=50, blank=False, null=False, unique=True,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least ' +
                                                '2 characters.')),
                    MaxLengthValidator(limit_value=50,
                                       message=('Must not exceed 50 ' +
                                                'characters.'))],
        error_messages={'unique': 'Tag name must be unique.'})
    date_created = CustomDateTimeField(blank=False, null=False)

    @property
    def tagged_journals(self):
        num_journals: int = len(self.journals.all())
        return num_journals

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = 'Tags'
        db_table = 'dashboard_tags'
