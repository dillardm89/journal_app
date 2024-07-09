from django.contrib import admin
from .models.tag import Tag
from .admin_models.tag import TagAdmin

admin.site.register(Tag, TagAdmin)
