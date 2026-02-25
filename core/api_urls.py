from django.urls import path
from rest_framework import routers

from . import api_views

router = routers.DefaultRouter()
router.register("services", api_views.ServiceViewSet, basename="service")
router.register("trainers", api_views.TrainerViewSet, basename="trainer")

urlpatterns = [
    *router.urls,
]

