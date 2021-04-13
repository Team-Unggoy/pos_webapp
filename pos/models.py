from django.db import models
from django.utils.datetime_safe import datetime
from django.utils import timezone


# Create your models here.

class PurchaseOrder(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    posting_datetime = models.DateTimeField(blank=True)
    purchase_order_number = models.CharField(primary_key=True ,max_length=255, blank=True, null=False, default=None)
    supplier = models.CharField(max_length=100, blank=True, default=None)
    status = models.CharField(max_length=100, blank=True, default='Draft')
    is_received = models.BooleanField(default=False)

    class Meta:
        ordering = ['-modified']

    def save(self,*args, **kwargs):
        if not self.purchase_order_number:
            self.status = 'Submitted'
            self.is_received = False
            prefix = 'PO-{}'.format(timezone.now().strftime('%y%m%d'))
            prev_instances = self.__class__.objects.filter(purchase_order_number__contains=prefix)
            if prev_instances.exists():
                last_instance_id = prev_instances.first().purchase_order_number[-4:]
                self.purchase_order_number = prefix+'{0:04d}'.format(int(last_instance_id)+1)
            else:
                self.purchase_order_number = prefix+'{0:04d}'.format(1)
            super(PurchaseOrder, self).save(*args, **kwargs)

    def __str__(self):
        return(self.purchase_order_number)


class PurchaseOrderItem(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified= models.DateTimeField(auto_now=True)
    purchase_order_number = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    barcode_number = models.CharField(max_length=13, blank=True)
    qty = models.PositiveIntegerField(default=1)
    cost = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)

  

    def __str__(self):
        return(self.name)

class PurchaseReceipt(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    posting_datetime = models.DateTimeField(blank=True)
    purchase_receipt_number = models.CharField(primary_key=True, max_length=255, blank=True, null=False, default=None)
    purchase_order_number = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    supplier = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default='None')
    invoice_amount = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
      
    class Meta:
        ordering = ['-modified']

    def save(self,*args, **kwargs):
        if not self.purchase_receipt_number:
            prefix = 'PR-{}'.format(timezone.now().strftime('%y%m%d'))
            prev_instances = self.__class__.objects.filter(purchase_receipt_number__contains=prefix)
            self.status = 'Submitted'
            if prev_instances.exists():
                last_instance_id = prev_instances.first().purchase_receipt_number[-4:]
                self.purchase_receipt_number = prefix+'{0:04d}'.format(int(last_instance_id)+1)
            else:
                self.purchase_receipt_number = prefix+'{0:04d}'.format(1)
            super(PurchaseReceipt, self).save(*args, **kwargs)

    def __str__(self):
        return(self.purchase_receipt_number)


class PurchaseReceiptItem(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    purchase_receipt_number = models.ForeignKey(PurchaseReceipt, related_name='items', on_delete=models.CASCADE)
    purchase_order_number = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    barcode_number = models.CharField(max_length=13, blank=True)
    qty = models.PositiveIntegerField(default=1)
    cost = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)

    def __str__(self):
        return(self.name)
    
class Item(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100)
    barcode_number = models.CharField(max_length=13, blank=True)
    enable = models.BooleanField(default=True)
    cost = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    srp = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    supplier = models.CharField(max_length=100, blank=True)

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

class StockTransaction(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    posting_datetime = models.DateTimeField(blank=True)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    qty = models.IntegerField(default=0)
    voucher_no = models.CharField(max_length=100)

    