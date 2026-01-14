from rest_framework import serializers
from .models import Book, Member, Loan, Category


from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    
    class Meta:
        model = Book
        fields = '__all__'
    
    def validate_copies_available(self, value):
        if value > self.initial_data.get('total_copies', 0):
            raise serializers.ValidationError("Available copies can't exceed total copies.")
        return value

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    member = MemberSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='book')
    member_id = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all(), source='member')
    
    class Meta:
        model = Loan
        fields = '__all__'





class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, label="Confirm Password")
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

