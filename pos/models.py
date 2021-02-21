from django.db import models
from django.utils.datetime_safe import datetime

# Create your models here.

class PurchaseOrder(models.Model):

    status_choice = [
        ('draft', 'Draft'),
        ('complete', 'Complete'),
        ('cancelled', 'Cancelled'),
    ]

    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    posting_date = models.DateField(blank=True)
    posting_time = models.TimeField(blank=True)
    order_number = models.AutoField(primary_key=True)
    status = models.CharField(max_length=10,choices=status_choice, default='draft')
    total = models.DecimalField(decimal_places=2, max_digits=10)
    
class Item(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100)
    barcode_number = models.CharField(max_length=13, blank=True)
    cost = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    srp = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    margin = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-modified']

    def __str__(self):
        return(self.name)

class PurchaseOrderItem(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modifeid= models.DateTimeField(auto_now=True)
    order_number = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    sku = models.ForeignKey(Item, max_length=100, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=1)
    price = models.DecimalField(decimal_places=2, max_digits=10)

    
class Order(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    total = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    payment = models.DecimalField(decimal_places=2, max_digits=10)
    change = models.DecimalField(decimal_places=2, max_digits=10)
