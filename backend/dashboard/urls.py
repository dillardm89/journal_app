from django.urls import (path, include)
from login.models.custom import OptionalSlashRouter
from .views.tag import TagViewSet


# Register viewset routes
router = OptionalSlashRouter()
router.register(prefix=r'tags', viewset=TagViewSet,
                basename='tags')

app_name = 'dashboard'

urlpatterns = [
    path('', include((router.urls, app_name), namespace=app_name))
]
