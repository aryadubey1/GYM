from __future__ import annotations

from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import ContactForm
from .models import (
    FAQ,
    HeroSlide,
    MembershipPlan,
    Service,
    SiteSetting,
    Testimonial,
    Trainer,
)
from .utils import send_telegram_message


def get_site_settings() -> SiteSetting | None:
    return SiteSetting.objects.first()


def home(request):
    settings = get_site_settings()
    hero_slides = HeroSlide.objects.filter(is_active=True)
    highlighted_services = Service.objects.filter(highlight=True)
    plans = MembershipPlan.objects.all()
    trainers = Trainer.objects.filter(is_featured=True)[:4]
    testimonials = Testimonial.objects.filter(is_active=True)[:6]

    context = {
        "site_settings": settings,
        "hero_slides": hero_slides,
        "highlighted_services": highlighted_services,
        "plans": plans,
        "trainers": trainers,
        "testimonials": testimonials,
    }
    return render(request, "core/home.html", context)


def about(request):
    settings = get_site_settings()
    trainers = Trainer.objects.filter(is_featured=True)
    testimonials = Testimonial.objects.filter(is_active=True)[:3]
    context = {
        "site_settings": settings,
        "trainers": trainers,
        "testimonials": testimonials,
    }
    return render(request, "core/about.html", context)


def services(request):
    settings = get_site_settings()
    services_qs = Service.objects.all()
    plans = MembershipPlan.objects.all()
    context = {
        "site_settings": settings,
        "services": services_qs,
        "plans": plans,
    }
    return render(request, "core/services.html", context)


def trainers(request):
    settings = get_site_settings()
    trainers_qs = Trainer.objects.all()
    context = {
        "site_settings": settings,
        "trainers": trainers_qs,
    }
    return render(request, "core/trainers.html", context)


def contact(request):
    settings: SiteSetting | None = get_site_settings()
    faqs = FAQ.objects.filter(is_active=True)

    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            submission = form.save()

            if settings and settings.telegram_bot_token and settings.telegram_chat_id:
                text_lines = [
                    "<b>New Contact Enquiry – Gym Website</b>",
                    f"Name: {submission.full_name}",
                    f"Email: {submission.email}",
                    f"Phone: {submission.phone or '-'}",
                    "",
                    submission.message or "",
                ]
                sent = send_telegram_message(
                    settings.telegram_bot_token,
                    settings.telegram_chat_id,
                    "\n".join(text_lines),
                )
                if sent:
                    submission.sent_to_telegram = True
                    submission.save(update_fields=["sent_to_telegram"])

            messages.success(
                request,
                "Thank you for reaching out. Our team will get back to you shortly.",
            )
            return redirect(reverse("core:contact"))
    else:
        form = ContactForm()

    context = {
        "site_settings": settings,
        "form": form,
        "faqs": faqs,
    }
    return render(request, "core/contact.html", context)

