# backend/app1/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('add-inventory/', views.add_inventory_item, name='add_inventory'),
    path('inventory/', views.list_inventory_items, name='list_inventory')
]
