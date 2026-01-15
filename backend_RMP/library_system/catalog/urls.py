from django.urls import path
from .views import (
    BookListCreateView, BookRetrieveUpdateDestroyView,
    MemberListCreateView, MemberRetrieveUpdateDestroyView,
    LoanListCreateView, LoanRetrieveUpdateDestroyView,
    CategoryListCreateView, CategoryRetrieveUpdateDestroyView,
    calculate_overdue_fines
)
from .views import RegisterView, UserLoansView, CookieLoginView, BorrowBookView, update_profile, change_password, return_loan

# ADD THESE NEW IMPORTS:
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': getattr(user, 'email', '')
        })

class BookListAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from .models import Book  # Import here to avoid circular imports
        books = Book.objects.filter(copies_available__gt=0)
        serializer = BookSerializer(books, many=True)  # Use your existing serializer
        return Response(serializer.data)

urlpatterns = [
    # Books
    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookRetrieveUpdateDestroyView.as_view(), name='book-detail'),
    
    # ADD NEW AUTHENTICATED ENDPOINT:
    path('books/authenticated/', BookListAuthenticatedView.as_view(), name='book-list-auth'),
    
    # Members
    path('members/', MemberListCreateView.as_view(), name='member-list-create'),
    path('members/<int:pk>/', MemberRetrieveUpdateDestroyView.as_view(), name='member-detail'),
    
    # Loans
    path('loans/', LoanListCreateView.as_view(), name='loan-list-create'),
    path('loans/<int:pk>/', LoanRetrieveUpdateDestroyView.as_view(), name='loan-detail'),
    
    # Categories
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),
    
    # Custom fine calculation
    path('calculate-fines/', calculate_overdue_fines, name='calculate-fines'),

    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/cookie-login/', CookieLoginView.as_view(), name='cookie-login'),

    path('books/<int:book_id>/borrow/', BorrowBookView.as_view(), name='borrow-book'),

    
    # ADD NEW USER ENDPOINT:
    path('auth/me/', UserMeView.as_view(), name='me'),
    
    path('me/loans/', UserLoansView.as_view(), name='user-loans'),


    path('profile/update/', update_profile),
    path('profile/password/', change_password),

    path('loans/<int:loan_id>/return/', return_loan),


]
