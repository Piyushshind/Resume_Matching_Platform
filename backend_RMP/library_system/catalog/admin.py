from django.contrib import admin
from .models import Book, Member, Loan, Category

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'isbn', 'category', 'copies_available']
    list_filter = ['category']
    search_fields = ['title', 'isbn']

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'join_date']
    search_fields = ['name', 'email']

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ['book', 'member', 'issue_date', 'status', 'fine_amount']
    list_filter = ['status', 'issue_date']
    raw_id_fields = ['book', 'member']  # For better performance

admin.site.register(Category)
