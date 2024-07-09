from django.contrib import admin


class TagAdmin(admin.ModelAdmin):
    ''' TagAdmin: class for Tag model in admin panel

        Args:
            ModelAdmin (class): Django model admin class
    '''
    list_filter = ('name', 'user')
    list_display = ('name', 'user', 'tagged_journals', 'date_created')
    search_fields = ('name', 'user')
    readonly_fields = ['date_created', 'user', 'tagged_journals']
    fieldsets = [
        ('Tag Details', {'fields': [
            'name', 'date_created', 'tagged_journals', 'user'
        ]})]

    def tagged_journals(self, obj) -> int:
        ''' tagged_journals: function to get the number of journals
            for a specific Tag

            Args:
                obj (Tag): Object of class Tag

            Returns:
                integer (num_journals): count of the number of journals
                    of class Journal assiated to the tag

        '''
        num_journals: int = len(obj.journals.all())
        return num_journals
