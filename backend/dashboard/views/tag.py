from datetime import (datetime, timezone)
from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from ..models.tag import Tag
from ..serializers.tag import TagSerializer
from ..functions.tag import (find_tag_by_id, find_tags_by_user,
                             find_tag_by_name)
from login.utils.responses import invalid_request_body
from ..utils.responses import (no_tag_found, tag_deleted,
                               tag_update_failed, create_tag_failed,
                               tag_exists)


class TagViewSet(viewsets.ViewSet):
    ''' TagViewSet: custom Tag viewsets for handling
            API requests to 'dashboard/tags' routes

        Args:
            ViewSet (class): Django generic viewset model class
    '''
    lookup_field = 'id'

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def add_tag(self, request) -> Response:
        ''' add_tag: 'POST' route for 'dashboard/tags/add_tag'
            to create new instance of Tag model

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with Tag information and 'user'
                id string in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string
                response message or new Tag id if status=200 and 'status'
                integer with standard Http status code
        '''
        try:
            new_tag = request.data
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        new_tag['date_created'] = datetime.now(tz=timezone.utc).replace(
            microsecond=0)
        serializer = TagSerializer(data=new_tag)
        if not serializer.is_valid():
            return Response({'detail': create_tag_failed},
                            status=status.HTTP_207_MULTI_STATUS)
        serializer.save()
        tag: dict = serializer.data
        return Response({'detail': tag['id']},
                        status=status.HTTP_200_OK)

    def list(self, request) -> Response:
        ''' list: 'GET' route for 'dashboard/tags' to get all
                instances of Tag model

        Args:
            request (obj): object from client request (no data required)

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                TagSerializer data containing queryset of Tag
                database or error if no data found and 'status' integer with
                standard Http status code
        '''
        queryset: QuerySet[Tag] = Tag.objects.all().order_by('name')
        if len(queryset) == 0:
            return Response({'detail': no_tag_found},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = TagSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def user_tags(self, request) -> Response:
        ''' user_tags: 'POST' route for
                'dashboard/tags/user_tags' to get all instances
                of Tag model associated to a specific
                User instance by foreign key

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'user' id string
                in request.data


        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                TagSerializer data containing queryset of Tag
                database or error if no data found and 'status'
                integer with standard Http status code
        '''
        try:
            userId: str = request.data['user']
            response = find_tags_by_user(userId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        queryset: QuerySet[Tag] = response[0]
        serializer = TagSerializer(queryset, many=True)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def get_tag(self, request) -> Response:
        ''' get_tag: 'POST' route for 'dashboard/tags/get_tag'
                to return a specific Tag instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with a 'tag_id' and 'user'
                id strings in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' object of
                TagSerializer data containing Tag instance
                or error if no data found and 'status' integer
                with standard Http status code
        '''
        tagId: str = request.data['tag_id']
        response = find_tag_by_id(tagId)
        if response[1] == status.HTTP_404_NOT_FOUND:
            return Response({'detail': response[0]},
                            status=status.HTTP_207_MULTI_STATUS)
        tag: Tag = response[0]
        serializer = TagSerializer(tag)
        return Response({'detail': serializer.data},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['post'], detail=False)
    def check_name(self, request) -> Response:
        ''' check_name: 'POST' route for 'dashboard/tags/check_name' to
                determine whether a Tag instance exists for specific name
                and specific User

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with 'tag_name' and 'user'
                id strings in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string
                response message and 'status' integer with standard Http
                status code
        '''
        try:
            tag_name: str = request.data['tag_name']
            userId: str = request.data['user']
            response = find_tag_by_name(tag_name, userId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': no_tag_found},
                                status=status.HTTP_207_MULTI_STATUS)
            else:
                return Response({'detail': tag_exists},
                                status=response[1])
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['patch'], detail=False)
    def update_tag(self, request) -> Response:
        ''' update_tag: 'PATCH' route for
                'dashboard/tags/update_tag' to update selected
                field(s) for a specific Tag instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with a 'tag_id' string,
                'user' id string, and field(s) to be updated in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string
                response message and 'status' integer with
                standard Http status code
        '''
        try:
            if request.data['date_created']:
                return Response({'detail': invalid_request_body},
                                status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            pass

        try:
            tagId: str = request.data['tag_id']
            response = find_tag_by_id(tagId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        tag: Tag = response[0]
        serializer = TagSerializer(tag, data=request.data,
                                   partial=True)
        if not serializer.is_valid():
            return Response({'detail': tag_update_failed},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        tag: dict = serializer.data
        return Response({'detail': tag['id']},
                        status=status.HTTP_200_OK)

    @method_decorator(ensure_csrf_cookie)
    @action(methods=['delete'], detail=False)
    def remove_tag(self, request) -> Response:
        ''' remove_tag: 'DELETE' route for
            'dashboard/tags/remove_tag' to delete a specific Tag instance

        Args:
            request (obj): object from client request, specifically
                must contain a dictionary with an 'tag_id' and 'user'
                id strings in request.data

        Returns:
            Response (HttpResponse): object containing API response
                information, specifically a 'detail' string
                response message and 'status' integer with standard Http
                status code
        '''
        try:
            tagId: str = request.data['tag_id']
            response = find_tag_by_id(tagId)
            if response[1] == status.HTTP_404_NOT_FOUND:
                return Response({'detail': response[0]},
                                status=status.HTTP_207_MULTI_STATUS)
        except KeyError:
            return Response({'detail': invalid_request_body},
                            status=status.HTTP_400_BAD_REQUEST)

        tag: Tag = response[0]
        tag.delete()
        return Response({'detail': tag_deleted},
                        status=status.HTTP_200_OK)
