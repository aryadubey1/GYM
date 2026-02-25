from rest_framework import mixins, viewsets

from .models import Service, Trainer
from .serializers import ServiceSerializer, TrainerSerializer


class ServiceViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Service.objects.filter(highlight=True)
    serializer_class = ServiceSerializer


class TrainerViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Trainer.objects.filter(is_featured=True)
    serializer_class = TrainerSerializer

