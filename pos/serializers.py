from rest_framework import serializers
from django.db.models import Sum
from .models import Item, PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, PurchaseReceiptItem, SalesInvoice, SalesInvoiceItem, StockTransaction


class ItemSerializer(serializers.ModelSerializer):
    inventory = serializers.SerializerMethodField(method_name='get_inventory')
    class Meta:
        model = Item
        fields = ['id','name', 'cost', 'srp', 'barcode_number', 'enable', 'supplier', 'modified','creation', 'inventory']

    def get_inventory(self, obj):
        total_qty = StockTransaction.objects.filter(item=obj.id).aggregate(inventory=Sum('qty'))
        return 0 if total_qty['inventory'] == None else total_qty['inventory']
    



class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['id','name', 'barcode_number', 'qty', 'cost', 'item']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)
    class Meta:
        model = PurchaseOrder
        fields = ['posting_datetime', 'supplier', 'status', 'items', 'purchase_order_number', 'is_received']

    def create(self, validated_data):
        items = validated_data.pop('items')
        purchase_order_number = PurchaseOrder.objects.create(**validated_data)
        for item in items:
            print(item)
            PurchaseOrderItem.objects.create(purchase_order_number=purchase_order_number, **item)
        return purchase_order_number
    
class PurchaseOrderSerializerLatest(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = ['posting_datetime', 'supplier', 'status', 'items', 'purchase_order_number']

class PurchaseReceiptItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseReceiptItem
        fields = ['id','name', 'barcode_number', 'qty', 'cost', 'item']

class PurchaseReceiptSerializer(serializers.ModelSerializer):
    items = PurchaseReceiptItemSerializer(many=True)
    class Meta:
        model = PurchaseReceipt
        fields = ['posting_datetime', 'items', 'supplier', 'status', 'purchase_order_number', 'invoice_amount' , 'purchase_receipt_number']

    def create(self, validated_data):
        items = validated_data.pop('items')
        purchase_receipt_number = PurchaseReceipt.objects.create(**validated_data)
        PurchaseOrder.objects.filter(purchase_order_number=validated_data['purchase_order_number']).update(is_received=True)
        for item in items:
            PurchaseReceiptItem.objects.create(purchase_receipt_number=purchase_receipt_number, purchase_order_number=validated_data['purchase_order_number'], **item)
            StockTransaction.objects.create(voucher_no=purchase_receipt_number, voucher_type='Purchase Receipt', **item)
        return purchase_receipt_number

class SalesInvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesInvoiceItem
        fields = ['id', 'name', 'barcode_number', 'qty', 'cost', 'item']

class SalesInvoiceSerializer(serializers.ModelSerializer):
    items = SalesInvoiceItemSerializer(many=True)
    class Meta:
        model = SalesInvoice
        fields = ['posting_datetime', 'costumer', 'items', 'sales_invoice', 'sales_invoice_number']

    def create(self, validated_data):
        items = validated_data.pop('items')
        sales_invoice_number = SalesInvoice.objects.create(**validated_data)
        for item in items:
            SalesInvoiceItem.objects.create(sales_invoice_number=sales_invoice_number, **item)
            StockTransaction.objects.create(voucher_no=sales_invoice_number, voucher_type='Sales Invoice', **item)
        return sales_invoice_number





        





        
