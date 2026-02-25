release: python manage.py migrate && python manage.py collectstatic --noinput
web: gunicorn gym_site.wsgi