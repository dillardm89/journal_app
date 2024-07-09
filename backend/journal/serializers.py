from datetime import datetime
from rest_framework import serializers
from .models import Journal
from dashboard.serializers.tag import TagSerializer


class JournalSerializer(serializers.ModelSerializer):
    ''' JournalSerializer: custom Journal serializer for validating
            data and creating / updating instances of class Journal

        Args:
            ModelSerializer (class): Django generic serializer
                model class
    '''
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Journal
        fields = '__all__'

    def validate_title(self, value: str) -> str:
        # Validate title to return first letter capitalized each word
        title: str = value.title()
        return title

    def validate_date_created(self, value: datetime) -> datetime:
        # Validate date_created to remove microseconds from datetime
        date_created: datetime = value.replace(microsecond=0)
        return date_created

    def create(self, validated_data) -> Journal:
        # Create new instance of Journal model once data validated
        tag_ids: list = self.initial_data['tag_list']
        journal = Journal.objects.create(**validated_data)
        if len(tag_ids) > 0:
            for id in tag_ids:
                journal.tags.add(id)
        journal.save()
        return journal

    def update(self, instance, validated_data) -> Journal:
        # Update existing instance of Journal model once data validated
        try:
            tag_ids: list = self.initial_data['tag_list']
            current_tags: list = instance.tags.all()
            if len(tag_ids) > 0 and len(current_tags) > 0:
                for tag in current_tags:
                    instance.tags.remove(tag)

            if len(tag_ids) > 0:
                for id in tag_ids:
                    instance.tags.add(id)
        except KeyError:
            pass

        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
