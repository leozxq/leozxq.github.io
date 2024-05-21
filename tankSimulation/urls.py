from django.urls import path,re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # search all aquatic plants
    path('aquatic_plants/',views.aquatic_plants.as_view())
    # search one aquatic plant
]