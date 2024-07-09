# URL configuration for main_project
from django.contrib import admin
from django.urls import (path, include)
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', include('login.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('journal/', include('journal.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
