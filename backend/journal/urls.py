from django.urls import (path, include)
from login.models.custom import OptionalSlashRouter
from .views import JournalViewSet


# Register viewset routes
router = OptionalSlashRouter()
router.register(prefix=r'journals', viewset=JournalViewSet,
                basename='journals')

app_name = 'journal'

urlpatterns = [
    path('', include((router.urls, app_name), namespace=app_name))
]
