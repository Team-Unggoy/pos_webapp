from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverView, name='overview'),
    path('item-list/', views.ItemList, name='item-list'),
    path('item-detail/<str:pk>/', views.ItemDetail, name='item-detail'),
    path('item-create/', views.ItemCreate, name='item-create'),
    path('item-update/<str:pk>/', views.ItemUpdate, name='item-update'),
    path('item-delete/', views.ItemDelete, name='item-delete'),
    path('item-list-active/', views.ActiveItems, name='item-list-active'),
    path('item-list-supplier/<str:supplier>/', views.ItemsUnderSupplier, name='item-list-supplier'),

    path('purchaseorder-list-submitted/', views.submittedPurchaseOrderList, name='purchaseorder-list-submitted'),

    path('purchaseorder-create/', views.PurchaseOrderCreate, name='purchaseorder-create'),
    path('purchaseorder-list/', views.PurchaseOrderList, name='purchaseorder-list'),
    path('purchaseorder-detail/<str:pk>/', views.PurchaseOrderDetailView, name='purchaseorder-detail'),

    path('purchasereceipt-create/', views.PurchaseReceiptCreate, name='purchasereceipt-create'),

    path('salesinvoice-create/', views.SalesInvoiceCreate, name='salesinvoice-create'),

]