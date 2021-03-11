from rest_framework import serializers
from .models import Item, PurchaseOrder, PurchaseOrderItem

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['name', 'cost', 'srp']

class PurchaseOrderItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['name', 'qty', 'cost']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    purchaseorderitems = PurchaseOrderItemSerializers(many=True)
    class Meta:
        model = PurchaseOrder
        fields = ['status', 'supplier', 'purchaseorderitems']

    def create(self, validated_data):
        print(validated_data)
        print('def creat12312e')



        
