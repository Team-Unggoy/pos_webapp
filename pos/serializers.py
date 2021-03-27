from rest_framework import serializers
from .models import Item, PurchaseOrder, PurchaseOrderItem

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
        fields = ['order_number','posting_datetime', 'supplier', 'status', 'items']

    def create(self, validated_data):
        items = validated_data.pop('items')
        order_number = PurchaseOrder.objects.create(**validated_data)
        for item in items:
            PurchaseOrderItem.objects.create(order_number=order_number, **item)
        return order_number




        
