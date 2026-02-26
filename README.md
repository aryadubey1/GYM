## FitForge Gym Website (Django + Tailwind CDN)

**Stack**: Django 5, Django REST Framework, HTML templates, Tailwind CSS via CDN, vanilla JS, Telegram Bot API.

### 1. Setup & Run

```bash
cd "D:\GYM WEB\TEMP1"
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt

.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py create_default_admin
.venv\Scripts\python manage.py runserver
```

Then open `http://127.0.0.1:8000/` in your browser.

### 2. Admin Access

- **URL**: `http://127.0.0.1:8000/admin/`
- **Username**: `DJANGO_SUPERUSER_USERNAME`
- **Password**: `DJANGO_SUPERUSER_PASSWORD`

From the admin you can fully customise:

- `Site settings` (name, tagline, address, phones, email, Google Maps embed URL, Telegram bot token & chat id)
- `Services` (Cardio, Diet Coaching, Boxing, Zumba, Yoga, etc.)
- `Membership plans` (One Day Pass, Premium Pack, Family Pack, etc.)
- `Trainers` (name, role, specialty, bio, photo, social links)
- `Hero slides` (landing page slider)
- `Testimonials`, `FAQs`, and stored `Contact submissions`

### 3. Telegram Contact Integration

1. Create a Telegram bot with `@BotFather` and copy the **bot token**.
2. Get the **chat id** of the destination chat (e.g. by messaging your bot then using a simple chat-id finder bot / script).
3. In Django admin, open **Site settings** and fill:
   - `Telegram bot token`
   - `Telegram chat id`
4. Every time someone submits the **Contact** form, a nicely formatted message is pushed to that chat and stored in `Contact submissions`.

### 4. Google Maps on Contact Page

1. Go to Google Maps, search your gym location.
2. Use **Share → Embed a map → Copy HTML**.
3. Extract the `src="..."` URL and paste it into **Google maps embed url** in **Site settings**.
4. The Contact page will show the live map in an iframe.

### 5. API Endpoints (Public)

- `GET /api/services/` → highlighted services (JSON)
- `GET /api/trainers/` → featured trainers (JSON)

These can be used later for mobile apps or a SPA front-end.

