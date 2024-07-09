import uuid
from django.core.validators import (MinLengthValidator, MaxLengthValidator)
from django.db import models
from login.models.custom import CustomDateTimeField
from login.models.user import User
from dashboard.models.tag import Tag


class Journal(models.Model):
    ''' Journal: custom Journal model associated to
            User model by foreign key and Many-To-Many
            relationship to Tag model

        Args:
            Model (class): Django generic model class
    '''
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, blank=False, null=False,
                             on_delete=models.CASCADE,
                             related_name='journals')
    tags = models.ManyToManyField(Tag, blank=True,
                                  related_name='journals')
    title = models.CharField(
        max_length=100, blank=False, null=False,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least ' +
                                                '2 characters.')),
                    MaxLengthValidator(limit_value=100,
                                       message=('Must not exceed 100 ' +
                                                'characters.'))])
    content = models.TextField(
        blank=False, null=False,
        validators=[MinLengthValidator(limit_value=2,
                                       message=('Must be at least ' +
                                                '2 characters.'))])
    date_created = CustomDateTimeField(blank=False, null=False)

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name_plural = 'journals'
        db_table = 'journal_journals'
