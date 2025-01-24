from django.shortcuts import render

# Create your views here.
# backend/app1/views.py
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import User, Inventory
import bcrypt  # To hash passwords securely
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from .models import Inventory
from .serializers import InventorySerializer

@api_view(['POST'])
def register_user(request):
    # Get data from the request
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')

    # Check if the user already exists
    if User.objects.filter(email=email).exists():
        return Response({'message': 'User already exists!'}, status=status.HTTP_400_BAD_REQUEST)

    # Hash the password using Django's built-in make_password()
    hashed_password = make_password(password)

    # Save user to the database
    user = User(email=email, password=hashed_password, role=role)
    user.save()

    return Response({'message': 'User successfully registered!'}, status=status.HTTP_201_CREATED)
@api_view(['POST'])
def login_user(request):
    email = request.data['email']
    password = request.data['password']
    print("email:",email)

    try:
        user = User.objects.get(email=email)

        print(user)

        # Use Django's check_password instead of bcrypt.checkpw()
        if check_password(password, user.password):
            return JsonResponse({'message': 'Login successful', 'role': user.role}, status=200)
        else:
            return JsonResponse({'message': 'Incorrect password!'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'message': 'User does not exist!'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def add_inventory_item(request):
    # Get data from the request
    item_name = request.data.get('item_name')
    count = request.data.get('count')
    brand = request.data.get('brand')
    rack_number = request.data.get('rack_number')
    description = request.data.get('description')

    # Save the inventory item to the database
    inventory_item = Inventory(
        item_name=item_name,
        count=int(count),
        brand=brand,
        rack_number=rack_number,
        description=description
    )
    inventory_item.save()

    return Response({'message': 'Inventory item added successfully!'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def list_inventory_items(request):
    inventory_items = Inventory.objects.all()
    serializer = InventorySerializer(inventory_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)