from django.shortcuts import render

# Create your views here.
# backend/app1/views.py
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import User, Inventory
import bcrypt  # To hash passwords securely

# Registration view: Register new users
def register_user(request):
    if request.method == "POST":
        # Get data from the request
        email = request.POST.get('email')
        password = request.POST.get('password')
        role = request.POST.get('role')

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Save user to the database
        user = User(email=email, password=hashed_password, role=role)
        user.save()

        return JsonResponse({'message': 'User successfully registered!'}, status=201)

    return render(request, 'register.html')


# Login view: Authenticate users
def login_user(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            # Fetch the user from the database
            user = User.objects.get(email=email)

            # Compare the hashed password with the stored one
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                return JsonResponse({'message': 'Login successful', 'role': user.role}, status=200)
            else:
                return JsonResponse({'message': 'Incorrect password!'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'message': 'User does not exist!'}, status=404)

    return render(request, 'login.html')


# Add an inventory item view
def add_inventory_item(request):
    if request.method == "POST":
        item_name = request.POST.get('item_name')
        count = request.POST.get('count')
        brand = request.POST.get('brand')
        rack_number = request.POST.get('rack_number')
        description = request.POST.get('description')

        # Save the inventory item to the database
        inventory_item = Inventory(
            item_name=item_name,
            count=int(count),
            brand=brand,
            rack_number=rack_number,
            description=description
        )
        inventory_item.save()

        return JsonResponse({'message': 'Inventory item added successfully!'}, status=201)

    return render(request, 'add_inventory.html')
