from rest_framework import serializers
from .models import Book, Lending, LendingHistory
from accounts.serializers import LendingUserSerializer


class BookSerializer(serializers.ModelSerializer):
    available = serializers.SerializerMethodField(read_only=True)

    def get_available(self, obj):
        if getattr(obj, 'available', None) is not None:
            return obj.available > 0

        return obj.is_available()

    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('created', 'modified')


class LendingHistorySerializer(serializers.ModelSerializer):
    user = LendingUserSerializer()

    class Meta:
        model = LendingHistory
        exclude = ('lending',)


class BookTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'title')


class LendingSerializer(serializers.ModelSerializer):
    history = LendingHistorySerializer(many=True)
    last_change = LendingHistorySerializer()
    book = BookTitleSerializer()

    class Meta:
        model = Lending
        fields = '__all__'
