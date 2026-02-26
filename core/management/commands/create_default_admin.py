from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
import os

class Command(BaseCommand):
    help = "Create a superuser using environment variables."

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.getenv('DJANGO_SUPERUSER_USERNAME')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD')
        email = os.getenv('DJANGO_SUPERUSER_EMAIL')


        if not password:
            self.stdout.write(self.style.ERROR("DJANGO_SUPERUSER_PASSWORD not set in environment."))
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"User '{username}' already exists."))
            return

        User.objects.create_superuser(username=username, password=password, email=email)
        self.stdout.write(self.style.SUCCESS(f"Successfully created superuser: {username}"))

