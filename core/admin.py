from django.contrib import admin

from .models import (
    ContactSubmission,
    FAQ,
    HeroSlide,
    MembershipPlan,
    Service,
    SiteSetting,
    Testimonial,
    Trainer,
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "highlight", "order")
    list_filter = ("highlight",)
    search_fields = ("name", "short_tagline", "description")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")


@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ("name", "price_per_month", "is_featured", "order")
    list_filter = ("is_featured",)
    search_fields = ("name", "description")
    ordering = ("order", "price_per_month")


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "specialty", "experience_years", "is_featured")
    list_filter = ("is_featured",)
    search_fields = ("name", "role", "specialty", "bio")
    ordering = ("order", "name")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "rating", "is_active", "order")
    list_filter = ("rating", "is_active")
    search_fields = ("name", "quote")
    ordering = ("order", "-created_at")


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle")
    ordering = ("order",)


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "phone",
        "source_page",
        "sent_to_telegram",
        "created_at",
    )
    list_filter = ("sent_to_telegram", "source_page", "created_at")
    search_fields = ("full_name", "email", "phone", "message")
    readonly_fields = ("created_at", "updated_at")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "is_active", "order")
    list_filter = ("is_active",)
    search_fields = ("question", "answer")
    ordering = ("order",)


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("site_name", "city", "state", "phone_primary", "email")
