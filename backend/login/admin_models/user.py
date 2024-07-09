from django.contrib import admin


class UserAdmin(admin.ModelAdmin):
    ''' UserAdmin: class for User model in admin panel

        Args:
            ModelAdmin (class): Django model admin class
    '''
    list_filter = ('email', 'username')
    list_display = ('email', 'username', 'first_name',
                    'last_name', 'last_login')
    search_fields = ('email', 'username')
    readonly_fields = ['journal_tags', 'journals', 'date_created']
    fieldsets = [
        ('User Details', {'fields': [
            'email', 'username', 'first_name', 'last_name', 'password',
            'last_login', 'email_verified', 'is_admin', 'deleted',
            'date_created'
        ]}),
        ('Journal Tags', {'fields': ['journal_tags']}),
        ('User Journals', {'fields': ['journals']})]

    def journal_tags(self, obj) -> list:
        ''' journal_tags: function to get list of
            tags for specific user

            Args:
                obj (User): Object of class User

            Returns:
                list (tag_list): list of 'name' strings for
                tags of class Tag associated by
                foreign key to the user
        '''
        tags = obj.tags.all().values()
        tag_list: list = []
        for tag in tags:
            tag_list.append(tag['name'])
        return tag_list

    def journals(self, obj) -> int:
        ''' journals: function to get the number of journals
            for a specific user

            Args:
                obj (User): Object of class User

            Returns:
                integer (num_journals): count of the number of journals
                    of class Journal assiated by foreign key
                    to the User

        '''
        num_journals: int = len(obj.journals.all())
        return num_journals
