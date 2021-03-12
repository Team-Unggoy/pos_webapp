from django.db import models
from django.utils.datetime_safe import datetime

# Create your models here.

class PurchaseOrder(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    posting_datetime = models.DateTimeField(blank=True)
    order_number = models.AutoField(primary_key=True)
    supplier = models.CharField(max_length=100, blank=True, default=None)
    status = models.CharField(max_length=100, default='None')

class PurchaseOrderItem(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modifeid= models.DateTimeField(auto_now=True)
    order_number = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    qty = models.PositiveIntegerField(default=1)
    cost = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)

    def __str__(self):
        return(self.name)
    
class Item(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100)
    posting_datetime = models.DateTimeField(blank=True)
    barcode_number = models.CharField(max_length=13, blank=True)
    cost = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    srp = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    margin = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-modified']

    def __str__(self):
        return(self.name)



    
class Order(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    total = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    payment = models.DecimalField(decimal_places=2, max_digits=10)
    change = models.DecimalField(decimal_places=2, max_digits=10)
