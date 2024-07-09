import base64
from io import (StringIO, BytesIO)
from xhtml2pdf import pisa
from datetime import (datetime, timezone)
from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Journal
from .serializers import JournalSerializer
from .functions import (find_journal_by_id, find_journals_by_user,
                        find_journals_by_search)
from login.utils.responses import invalid_request_body
from .utils.responses import (no_journal_found, journal_deleted,
                              journal_update_failed, create_journal_failed,
                              export_failed)


class JournalViewSet(viewsets.ViewSet):
    ''' JournalViewSet: custom Journal viewsets for handling
            API requests to 'journal/journals' routes

        Args:
            ViewSet (class): Django generic viewset model class
    '''
    lookup_field = 'id'

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def add_journal(self, request) -> Response:
        ''' add_journal: 'POST' route for 'journal/journals/add_journal'
                to create new instance of Journal model

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with Journal information and
                'user' id string in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string response
                message or new Journal id if status=200 and 'status'
                integer with standard Http status code
        '''
        try:
            new_journal = request.data
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        new_journal['date_created'] = datetime.now(tz=timezone.utc).replace(
            microsecond=0)
        serializer = JournalSerializer(data=new_journal)
        if not serializer.is_valid():
            return Response({'detail': create_journal_failed},
                            status=status.HTTP_207_MULTI_STATUS)
        serializer.save()
        journal: dict = serializer.data
        return Response({'detail': journal['id']},
                        status=status.HTTP_200_OK)

    def list(self, request) -> Response:
        ''' list: 'GET' route for 'journal/journals' to get all
                instances of Journal model

        Args:
            request (obj): object from client request (no data required)

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                JournalSerializer data containing queryset of Journal
                database or error if no data found and 'status' integer
                with standard Http status code
        '''
        queryset: QuerySet[Journal] = Journal.objects.all()
        if len(queryset) == 0:
            return Response({'detail': no_journal_found},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = JournalSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def user_journals(self, request) -> Response:
        ''' user_journals: 'POST' route for 'journal/journals/user_journals'
                to get all instances of Journal model associated to a
                specific User instance by foreign key

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'user' id string
                in request.data


        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                JournalSerializer data containing queryset of Journal
                database or error if no data found and 'status' integer with
                standard Http status code
        '''
        try:
            user_id: str = request.data['user']
            response = find_journals_by_user(user_id)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset: QuerySet[Journal] = response[0]
        serializer = JournalSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def search_journals(self, request) -> Response:
        ''' search_journals: 'POST' route for
                'journal/journals/search_journals' to
                get all instances of Journal model associated to
                a specific User instance by foreign key and matching
                user keywords for search type (title, tags, date, or content)

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'user' id, 'search_type',
                and 'search_text' strings in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                JournalSerializer data containing queryset of Journal
                database or error if no data found and 'status' integer
                with standard Http status code
        '''
        try:
            user_id: str = request.data['user']
            search_type: str = request.data['search_type']
            search_text: str = request.data['search_text']
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        valid_type: list = ['title', 'tags', 'content', 'date']
        if search_type not in valid_type:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        response = find_journals_by_search(user_id, search_type, search_text)
        if response[1] != status.HTTP_200_OK:
            return Response({'detail': response[0]},
                            status=status.HTTP_207_MULTI_STATUS)

        data: list = response[0]
        return Response({'detail': data}, status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def get_journal(self, request) -> Response:
        ''' get_journal: 'POST' route for 'journal/journals/get_journal'
                to return a specific Journal instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'journal_id' and 'user'
                id strings in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                JournalSerializer data containing Journal instance
                or error if no data found and 'status' integer with
                standard Http status code
        '''
        try:
            journal_id: str = request.data['journal_id']
            response = find_journal_by_id(journal_id)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        journal: Journal = response[0]
        serializer = JournalSerializer(journal)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def export_journal(self, request) -> (Response):
        ''' export_journal: 'POST' route for 'journal/journals/export_journal'
                to create pdf of journal based on provided html content string

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'user' id string
                and 'html_content' string in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string response
                message or base64 representation of pdf document
                and 'status' integer with standard Http status
                code
        '''
        try:
            html_content: str = request.data['html_content']
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        pdf_file = BytesIO()
        pisa_status = pisa.CreatePDF(StringIO(html_content), dest=pdf_file)
        pdf_b64: bytes = base64.b64encode(pdf_file.getvalue())

        if pisa_status.err:
            return Response({'detail': export_failed},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': pdf_b64}, status=status.HTTP_200_OK)

    @ method_decorator(ensure_csrf_cookie)
    @ action(methods=['patch'], detail=False)
    def update_journal(self, request) -> Response:
        ''' update_journal: 'PATCH' route for 'journal/journals/update_journal'
                to update selected field(s) for a specific Journal instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'journal_id' string,
                'user' id string, and field(s) to be updated in
                request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string response
                message and 'status' integer with standard Http status
                code
        '''
        try:
            if request.data['date_created']:
                return Response({'detail': invalid_request_body},
                                status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            pass

        try:
            journal_id: str = request.data['journal_id']
            response = find_journal_by_id(journal_id)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        journal: Journal = response[0]
        serializer = JournalSerializer(journal, data=request.data,
                                       partial=True)
        if not serializer.is_valid():
            return Response({'detail': journal_update_failed},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        journal: dict = serializer.data
        return Response({'detail': journal['id']},
                        status=status.HTTP_200_OK)

    @ method_decorator(ensure_csrf_cookie)
    @ action(methods=['delete'], detail=False)
    def remove_journal(self, request) -> Response:
        ''' remove_journal: 'DELETE' route for
                'journal/journals/remove_journal' to delete a
                specific Journal instance

        Args:
            request(obj): object from client request, specifically
            must contain a dictionary with 'journal_id' and 'user'
            id strings in request.data

        Returns:
            Response(HttpResponse): object containing API response
            information, specifically a 'detail' string onse mes
            age and 'status' integer with standard Http
            status code
        '''
        try:
            journal_id: str = request.data['journal_id']
            response = find_journal_by_id(journal_id)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        journal: Journal = response[0]
        journal.delete()
        return Response({'detail': journal_deleted},
                        status=status.HTTP_200_OK)
