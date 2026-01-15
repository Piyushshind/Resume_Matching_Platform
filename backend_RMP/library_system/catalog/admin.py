from django.contrib import admin
from .models import Book, Member, Loan, Category

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'isbn', 'category', 'copies_available', 'total_copies']
    list_filter = ['category']
    search_fields = ['title', 'isbn']
    list_per_page = 20

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'join_date']  # Use actual Member fields
    list_filter = ['join_date']
    search_fields = ['name', 'email', 'phone']
    list_per_page = 20

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    # Use ACTUAL Loan model fields (check your models.py)
    raw_id_fields = ['book', 'member'] 
    list_display = ['get_book_title', 'get_member_name', 'issue_date', 'due_date', 'return_date', 'fine_amount']
    list_filter = ['issue_date', 'due_date', 'return_date']
    readonly_fields = ['fine_amount']
    list_per_page = 20
    
    # Custom methods to display related fields
    def get_book_title(self, obj):
        return obj.book.title if obj.book else '-'
    get_book_title.short_description = 'Book'
    
    def get_member_name(self, obj):
        return obj.member.name if obj.member else '-'
    get_member_name.short_description = 'Member'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
