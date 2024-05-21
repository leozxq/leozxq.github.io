from django.db import models

# Create your models here.
class Aquatic_plants(models.Model):
    name= models.CharField(max_length=100)
    classify=models.CharField(max_length=100)