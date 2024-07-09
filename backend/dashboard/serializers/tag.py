from datetime import datetime
from rest_framework import serializers
from ..models.tag import Tag


class TagSerializer(serializers.ModelSerializer):
    ''' TagSerializer: custom Tag serializer for validating
            data and creating / updating instances of class Tag

        Args:
            ModelSerializer (class): Django generic serializer
                model class
    '''
    tagged_journals = serializers.ReadOnlyField()

    class Meta:
        model = Tag
        fields = '__all__'

    def validate_name(self, value: str) -> str:
        # Validate name to return first letter capitalized each word
        name: str = value.title()
        return name

    def validate_date_created(self, value: datetime) -> datetime:
        # Validate date_created to remove microseconds from datetime
        date_created: datetime = value.replace(microsecond=0)
        return date_created

    def create(self, validated_data) -> Tag:
        # Create new instance of Tag model once data validated
        return Tag.objects.create(**validated_data)

    def update(self, instance, validated_data) -> Tag:
        # Update existing instance of Tag model once data validated
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
