from rest_framework import serializers
from .models import Item, PurchaseOrder, PurchaseOrderItem

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['name', 'cost', 'srp']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'

        def create(self, validated_data):
            print('creating')


class PurchaseOrderItemSerializers(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        
