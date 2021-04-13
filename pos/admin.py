from django.contrib import admin
from .models import Item, PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, PurchaseReceiptItem, StockTransaction

# Register your models here.

admin.site.register(Item)
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderItem)
admin.site.register(PurchaseReceipt)
admin.site.register(PurchaseReceiptItem)
admin.site.register(StockTransaction)