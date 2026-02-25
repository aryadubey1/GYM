from rest_framework import serializers

from .models import Service, Trainer


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "slug",
            "short_tagline",
            "description",
            "highlight",
            "icon",
        ]


class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = [
            "id",
            "name",
            "role",
            "bio",
            "specialty",
            "experience_years",
            "photo",
            "instagram_url",
            "facebook_url",
            "youtube_url",
        ]

