from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

class Book(models.Model):
    title = models.CharField(max_length=200)
    isbn = models.CharField(max_length=13, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    copies_available = models.IntegerField(default=1, validators=[MinValueValidator(0)])
    total_copies = models.IntegerField(default=1)

class Member(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    join_date = models.DateField(auto_now_add=True)
    max_loans = models.IntegerField(default=3)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)


class Loan(models.Model):
    STATUS_CHOICES = [('issued', 'Issued'), ('returned', 'Returned'), ('overdue', 'Overdue')]
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='issued')
    fine_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
