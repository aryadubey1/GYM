#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell << END
from django.contrib.auth import get_user_model
import os
User = get_user_model()
username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'Ary@123')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"CREATED SUPERUSER: {username}")
else:
    # Optional: Force update password if you aren't sure it's right
    u = User.objects.get(username=username)
    u.set_password(password)
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print(f"UPDATED SUPERUSER: {username}")
END