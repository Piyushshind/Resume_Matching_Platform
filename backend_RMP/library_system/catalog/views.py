from rest_framework import generics, filters, status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User 
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book, Member, Loan, Category
from .serializers import BookSerializer, MemberSerializer, LoanSerializer, CategorySerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import permission_classes

# Book CRUD APIs
class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name', 'copies_available']
    search_fields = ['title', 'isbn']
    ordering_fields = ['title', 'copies_available']

class BookRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

# Member CRUD APIs  
class MemberListCreateView(generics.ListCreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email']

class MemberRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

# Loan CRUD APIs
class LoanListCreateView(generics.ListCreateAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'book__isbn']
    search_fields = ['member__name']

class LoanRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

# Category CRUD APIs  
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Custom API for calculating overdue fines (PL/SQL integration preview)
@api_view(['POST'])
def calculate_overdue_fines(request):
    loan_id = request.data.get('loan_id')
    with connection.cursor() as cursor:
        cursor.execute("SELECT calculate_fine(%s)", [loan_id])
        fine = cursor.fetchone()[0]
    return Response({"loan_id": loan_id, "fine_amount": float(fine)})
    try:
        loan = Loan.objects.get(id=loan_id)
        # PL/SQL function call will go here
        fine = 1.50  # Placeholder - actual PL/SQL calculation
        loan.fine_amount = fine
        loan.save()
        serializer = LoanSerializer(loan)
        return Response(serializer.data)
    except Loan.DoesNotExist:
        return Response({"error": "Loan not found"}, status=status.HTTP_404_NOT_FOUND)




class RegisterView(generics.CreateAPIView):
    # queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# class LoginView(TokenObtainPairView):
#     permission_classes = [AllowAny]



class CookieLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Set HttpOnly cookie instead of returning token
        if response.data.get('access'):
            response.set_cookie(
                key='access_token',
                value=response.data['access'],
                httponly=True,
                secure=False,  # True in production
                samesite='Strict',
                max_age=3600  # 1 hour
            )
            # Remove token from response body (security)
            response.data = {'message': 'Login successful'}
        
        return response


# User Dashboard - My Loans (Protected)
class UserLoansView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Loan.objects.filter(member__user=self.request.user)