from django.shortcuts import render
from django.views import View
# Create your views here.
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from tankSimulation import models


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

class aquatic_plants(APIView):
    def get(self,request):
        plants_obj=models.Aquatic_plants.objects.all()
        print(plants_obj)
        return Response(plants_obj)
    def post(self,request):
        return HttpResponse('post')
