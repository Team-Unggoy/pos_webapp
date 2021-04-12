from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Item, PurchaseOrder, PurchaseOrderItem
from .serializers import ItemSerializer, PurchaseOrderSerializer, PurchaseReceiptSerializer, PurchaseOrderSerializerLatest

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
    print(serializer)
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

@api_view(['PUT'])
def ItemUpdate(request, pk):
    item = Item.objects.get(id=pk)
    serializer = ItemSerializer(instance=item, data=request.data)
    if serializer.is_valid():
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
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
        
    return Response(serializer.data)

@api_view(['GET'])
def PurchaseOrderList(request):
    purchaseorders = PurchaseOrder.objects.all()
    serializer = PurchaseOrderSerializer(purchaseorders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def PurchaseOrderDetailView(request, pk):
    print('testing')

@api_view(['GET'])
def submittedPurchaseOrderList(request):
    purchaseorders = PurchaseOrder.objects.filter(status='Submitted')
    serializer = PurchaseOrderSerializer(purchaseorders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def PurchaseReceiptCreate(request):
    serializer = PurchaseReceiptSerializer(data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['GET'])
def PurchaseOrderLatest(request):
    purchaseorders = PurchaseOrder.objects.latest('purchase_order_number')
    print(purchaseorders, 'babantoto')
    serializer = PurchaseReceiptSerializer(purchaseorders, many=False)
    print(serializer.data, 'testing sa ko diri daw')
    return Response(serializer.data)
    

@api_view(['GET'])
def ActiveItems(request):
    items = Item.objects.filter(enable=True)
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def ItemsUnderSupplier(request, supplier):
    items = Item.objects.filter(supplier=supplier, enable=True)
    serializer = ItemSerializer(items, many=True)
    print(serializer)
    return Response(serializer.data)
    
