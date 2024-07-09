import re
from datetime import datetime
from django.db.models import QuerySet
from rest_framework import status
from .models import Journal
from .serializers import JournalSerializer
from dashboard.models.tag import Tag
from login.utils.responses import invalid_request_body
from .utils.responses import no_journal_found
from .utils.stop_words import STOP_WORDS


def find_journals_by_user(userId: str) -> list:
    ''' find_journals_by_user: function to get all Journal instance(s)
            associated with specific User instance

        Args:
            userId (str): id for requested User instance

        Returns:
            list: list containing a queryset of Journal instance(s) or
                response message and a 'status' integer with standard
                Http status code
    '''
    queryset: QuerySet[Journal] = Journal.objects.filter(
        user=userId).order_by('title')
    if len(queryset) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]
    return [queryset, status.HTTP_200_OK]


def find_journal_by_id(journalId: str) -> list:
    ''' find_journal_by_id: function to return Journal instance
            based on query by id field

        Args:
            journalId (str): id for requested Journal instance

        Returns:
            list: list containing either an instance of Journal class or
                response message and a 'status' integer with standard
                Http status code
    '''
    queryset: QuerySet[Journal] = Journal.objects.filter(id=journalId)
    if len(queryset) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]
    journal: Journal = queryset[0]
    return [journal, status.HTTP_200_OK]


def find_journals_by_search(userId: str, search_type: str,
                            search_text: str) -> list:
    ''' find_journals_by_search: function to handle searching by type

        Args:
            userId (str): id for requested User instance
            search_type (str): field to search on
                (title, tags, date, or content)
            search_text (str): keywords to search

        Returns:
            list: list containing a queryset of Journal instance(s) or
                response message and a 'status' integer with standard
                Http status code
    '''
    if search_type == 'date':
        try:
            date: datetime = datetime.fromisoformat(search_text)
            response = find_journals_by_date(userId, date)
            return [response[0], response[1]]
        except ValueError:
            return [invalid_request_body, status.HTTP_400_BAD_REQUEST]

    clean_search: list = clean_search_text(search_text)
    if search_type == 'tags':
        response = find_journals_by_tags(userId, clean_search)
    elif search_type == 'content' or search_type == 'title':
        response = find_journals_by_keyword(userId, search_type, clean_search)
    else:
        return [invalid_request_body, status.HTTP_400_BAD_REQUEST]
    return [response[0], response[1]]


def clean_search_text(search_text: str) -> list:
    search_text.lower()
    text_list: list = re.findall(r"\w+", search_text)
    search_list: list = []
    for string in text_list:
        if len(string) > 0 and string not in STOP_WORDS:
            search_list.append(string)
    return search_list


def find_journals_by_date(userId: str, date: datetime) -> list:
    ''' date: function to get all Journal instance(s)
            associated with specific User instance and matching date

        Args:
            userId (str): id for requested User instance
            date (datetime): date to search

        Returns:
            list: list containing a queryset of Journal instance(s) or
                response message and a 'status' integer with standard
                Http status code
    '''
    month: str = str(date.month)
    day: str = str(date.day)
    year: str = str(date.year)
    queryset: QuerySet[Journal] = Journal.objects.filter(
        user=userId, date_created__year=year, date_created__month=month,
        date_created__day=day).order_by('title')
    if len(queryset) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]

    serializer = JournalSerializer(queryset, many=True)
    return [serializer.data, status.HTTP_200_OK]


def find_journals_by_keyword(userId: str, search_type: str,
                             search_list: list) -> list:
    ''' find_journals_by_keyword: function to get all Journal instance(s)
            associated with specific User instance and matching user
            content or title keywords

        Args:
            userId (str): id for requested User instance
            search_type (str): field to search (title or content)
            search_list (list): keywords to search in content

        Returns:
            list: list containing a queryset of Journal instance(s) or
                response message and a 'status' integer with standard
                Http status code
    '''
    user_queryset: QuerySet[Journal] = Journal.objects.filter(user=userId)
    if len(user_queryset) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]

    journal_list: list = []
    for string in search_list:
        if search_type == 'title':
            queryset = user_queryset.filter(title__icontains=string)
        else:
            queryset = user_queryset.filter(content__icontains=string)
        if len(queryset) > 0:
            for journal in queryset:
                journal_list.append(journal.id)

    if len(journal_list) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]

    journal_list = list(set(journal_list))
    search_queryset = user_queryset.filter(id__in=journal_list)
    if len(search_queryset) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]

    serializer = JournalSerializer(search_queryset, many=True)
    return [serializer.data, status.HTTP_200_OK]


def find_journals_by_tags(userId: str, search_list: list) -> list:
    ''' find_journals_by_tags: function to get all Journal instance(s)
            associated with specific User instance and matching user
            tags keywords

        Args:
            userId (str): id for requested User instance
            search_list (list): keywords to search in tags

        Returns:
            list: list containing a queryset of Journal instance(s) or
                response message and a 'status' integer with standard
                Http status code
    '''
    tag_list: list = []
    for string in search_list:
        tag_queryset: QuerySet[Tag] = Tag.objects.filter(
            user=userId, name__icontains=string)
        if len(tag_queryset) > 0:
            for tag in tag_queryset:
                tag_list.append(tag.id)

    if len(tag_list) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]

    tag_list = list(set(tag_list))
    search_queryset: QuerySet[Journal] = Journal.objects.filter(
        user=userId, tags__id__in=tag_list)
    if len(search_queryset) == 0:
        return [no_journal_found, status.HTTP_404_NOT_FOUND]

    serializer = JournalSerializer(search_queryset, many=True)
    return [serializer.data, status.HTTP_200_OK]
