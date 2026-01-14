from django.urls import path
from .views import (
    BookListCreateView, BookRetrieveUpdateDestroyView,
    MemberListCreateView, MemberRetrieveUpdateDestroyView,
    LoanListCreateView, LoanRetrieveUpdateDestroyView,
    CategoryListCreateView, CategoryRetrieveUpdateDestroyView,
    calculate_overdue_fines
)
from .views import RegisterView, UserLoansView , CookieLoginView

urlpatterns = [
    # Books
    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookRetrieveUpdateDestroyView.as_view(), name='book-detail'),
    
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

    path('auth/register/', RegisterView.as_view(), name='register'),
    # path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/cookie-login/', CookieLoginView.as_view(), name='cookie-login'),

    path('me/loans/', UserLoansView.as_view(), name='user-loans'),
]
