from rest_framework import serializers
from .models import Item, PurchaseOrder, PurchaseOrderItem, PurchaseReceipt, PurchaseReceiptItem, StockTransaction

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id','name', 'cost', 'srp', 'barcode_number', 'enable', 'supplier', 'modified','creation']

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
        print(items, 'testing sa ko baban')
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
            print(item)
            PurchaseReceiptItem.objects.create(purchase_receipt_number=purchase_receipt_number, purchase_order_number=validated_data['purchase_order_number'], **item)
        return purchase_receipt_number
        





        
