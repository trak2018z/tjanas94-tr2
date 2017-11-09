from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    available = serializers.SerializerMethodField(read_only=True)

    def get_available(self, obj):
        return obj.count > 0

    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('created', 'modified')
