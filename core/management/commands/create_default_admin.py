from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a default superuser with username 'admin' and password 'Arya@123' if it does not exist."

    def handle(self, *args, **options):
        User = get_user_model()
        username = "admin"
        password = "Arya@123"
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING("Default admin user already exists."))
            return
        User.objects.create_superuser(username=username, password=password, email="")
        self.stdout.write(
            self.style.SUCCESS(
                f"Created default admin user: username='{username}', password='{password}'"
            )
        )

