from rest_framework import serializers
from .models import Item, PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, PurchaseReceiptItem

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id','name', 'cost', 'srp', 'barcode_number', 'enable', 'packing', 'modified','creation']

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['id','name', 'qty', 'cost']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)
    class Meta:
        model = PurchaseOrder
        fields = ['posting_datetime', 'supplier', 'status', 'items', 'purchase_order_number']

    def create(self, validated_data):
        items = validated_data.pop('items')
        purchase_order_number = PurchaseOrder.objects.create(**validated_data)
        for item in items:
            PurchaseOrderItem.objects.create(purchase_order_number=purchase_order_number, **item)
        return purchase_order_number

class PurchaseReceiptItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseReceiptItem
        fields = ['id', 'name', 'qty', 'cost']

class PurchaseReceiptSerializer(serializers.ModelSerializer):
    items = PurchaseReceiptItemSerializer(many=True)
    class Meta:
        model = PurchaseReceipt
        fields = ['posting_datetime', 'items', 'supplier', 'status', 'purchase_order_number', 'invoice_amount' , 'purchase_receipt_number']

    def create(self, validated_data):
        print('ga dagan nako diri?')
        items = validated_data('items')
        purchase_receipt_number = PurchaseReceipt.objects.create(**validated_data)
        for item in items:
            PurchaseReceiptItem.objects.create(purchase_receipt_number=purchase_receipt_number, **item)
        return purchase_receipt_number
        





        
