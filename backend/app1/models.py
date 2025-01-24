from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=256)
    role = models.CharField(max_length=50)

    def __str__(self):
        return self.email

class Inventory(models.Model):
    item_name = models.CharField(max_length=100)
    count = models.IntegerField()
    brand = models.CharField(max_length=100)
    rack_number = models.CharField(max_length=50)
    description = models.TextField()

    def __str__(self):
        return self.item_name
