from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Item, PurchaseOrder, PurchaseOrderItem
from .serializers import ItemSerializer, PurchaseOrderSerializer

# Create your views here.

@api_view(['GET'])
def apiOverView(request):
    overview = {
        'item-list/',
        'item-detail/<str:pk>',
        'item-create/',
        'item-update/<str:pk>',
        'item-delete',
    }
    return Response(overview)

@api_view(['GET'])
def ItemList(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ItemDetail(request, pk):
    items = Item.objects.get(id=pk)
    seriazlier = ItemSerializer(items, many=False)
    return Response(seriazlier.data)

@api_view(['POST'])
def ItemCreate(request):
    print('POST TESTING', request.data['name'])

    serializer = ItemSerializer(data=request.data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def ItemUpdate(request, pk):

    item = Item.objects.get(id = pk)
    serializer = ItemSerializer(instance=item, data=request.data)
    if serializer.is_valid:
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def ItemDelete(request,pk):
    item = Item.object.get(id=pk)
    item.delete()

    return Response('Item has been deleted')

@api_view(['POST'])
def PurchaseOrderCreate(request):
    serializer = PurchaseOrderSerializer(data=request.data)
    print(serializer)
    print(serializer.is_valid())
    if serializer.is_valid():
        print('Testing babantoto validity')
    
    return Response(serializer.data)

@api_view(['GET'])
def purchaseOrderList(request):
    purchaseorders = PurchaseOrder.objects.all()
    serializer = PurchaseOrderSerializer(purchaseorders, many=True)
    return Response(serializer.data)

