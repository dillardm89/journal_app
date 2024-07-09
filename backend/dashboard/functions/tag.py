from django.db.models import QuerySet
from rest_framework import status
from ..models.tag import Tag
from ..utils.responses import no_tag_found


def find_tags_by_user(userId: str) -> list:
    ''' find_tags_by_user: function to get all Tag instance(s)
            associated with specific User instance

        Args:
            userId (str): id for requested User instance

        Returns:
            list: list containing a queryset of Tag instance(s) or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[Tag] = Tag.objects.filter(
        user=userId).order_by('name')
    if len(queryset) == 0:
        return [no_tag_found, status.HTTP_404_NOT_FOUND]
    return [queryset, status.HTTP_200_OK]


def find_tag_by_id(tagId: str) -> list:
    ''' find_tag_by_id: function to return Tag instance
            based on query by id field

        Args:
            tagId (str): id for requested Tag instance

        Returns:
            list: list containing either an instance of Tag class or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[Tag] = Tag.objects.filter(id=tagId)
    if len(queryset) == 0:
        return [no_tag_found, status.HTTP_404_NOT_FOUND]
    tag: Tag = queryset[0]
    return [tag, status.HTTP_200_OK]


def find_tag_by_name(tag_name: str, userId: str) -> list:
    ''' find_tag_by_name: function to return Tag instance
            based on query by exact name field for a specific User instance

        Args:
            tag_name (str): name for requested Tag instance
            userId (str): id for specific User instance

        Returns:
            list: list containing either an instance of Tag class or
                    a human-readable response message and a 'status'
                    integer with standard Http status code
    '''
    queryset: QuerySet[Tag] = Tag.objects.filter(
        name=tag_name, user=userId)
    if len(queryset) == 0:
        return [no_tag_found, status.HTTP_404_NOT_FOUND]
    tag: Tag = queryset[0]
    return [tag, status.HTTP_200_OK]
