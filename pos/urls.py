from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverView, name='overview'),
    path('item-list/', views.ItemList, name='item-list'),
    path('item-detail/<str:pk>', views.ItemDetail, name='item-detail'),
    path('item-create/', views.ItemCreate, name='item-create'),
    path('item-udpate/<str:pk>', views.ItemUpdate, name='item-update'),
    path('item-delete/', views.ItemDelete, name='item-delete'),
]