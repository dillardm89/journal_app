from django.contrib import admin
from .models import Journal


class JournalAdmin(admin.ModelAdmin):
    ''' JournalAdmin: class for Journal model in admin panel

        Args:
            ModelAdmin (class): Django model admin class
    '''
    list_filter = ('title', 'user')
    list_display = ('date_created', 'title', 'user')
    search_fields = ('title', 'user', 'tags')
    readonly_fields = ['date_created', 'user']
    fieldsets = [
        ('Journal Details', {'fields': [
            'date_created', 'title', 'user', 'tags', 'content'
        ]})]


admin.site.register(Journal, JournalAdmin)
