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
from rest_framework.permissions import AllowAny 
from rest_framework import status
from rest_framework.response import Response
from .models import Loan
from .serializers import LoanSerializer
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import update_session_auth_hash


class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.filter(copies_available__gt=0)
    permission_classes = [AllowAny]
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
        
        access_token = response.data.get('access')
        
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            samesite='lax',
            secure=False,  # dev only
            max_age=3600   # 1 hour
        )
        
        response.data['access_token'] = access_token
        
        return response



# User Dashboard - My Loans (Protected)
class UserLoansView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Loan.objects.filter(member__user=self.request.user)







class BorrowBookView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id, copies_available__gt=0)
            loan = Loan.objects.create(
                member_id=request.user.id,  # Assuming User is member
                book=book,
                loan_date=timezone.now(),
                due_date=timezone.now() + timedelta(days=14)
            )
            book.copies_available -= 1
            book.save()
            
            serializer = LoanSerializer(loan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Book.DoesNotExist:
            return Response({"error": "Book not available"}, status=status.HTTP_400_BAD_REQUEST)







@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data
    
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.save()
    
    update_session_auth_hash(request, user)  # Keep logged in
    return Response({'message': 'Profile updated successfully'})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not user.check_password(old_password):
        return Response({'error': 'Old password incorrect'}, status=400)
    
    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)
    return Response({'message': 'Password changed successfully'})




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_loan(request, loan_id):
    try:
        loan = Loan.objects.get(id=loan_id, member_id=request.user.id)
        book = loan.book
        
        # Calculate fine if overdue
        if timezone.now() > loan.due_date:
            days_overdue = (timezone.now() - loan.due_date).days
            fine = days_overdue * 5  # $5 per day
        else:
            fine = 0
        
        loan.return_date = timezone.now()
        loan.fine_amount = fine
        loan.save()
        
        book.copies_available += 1
        book.save()
        
        return Response({
            'message': 'Book returned successfully',
            'fine': fine,
            'days_overdue': max(0, days_overdue)
        })
    except Loan.DoesNotExist:
        return Response({'error': 'Loan not found'}, status=404)
