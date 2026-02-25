from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Service(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    short_tagline = models.CharField(max_length=150, blank=True)
    description = models.TextField()
    highlight = models.BooleanField(default=False)
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text="Optional icon name (e.g. 'dumbbell', used in UI only).",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name


class MembershipPlan(TimeStampedModel):
    name = models.CharField(max_length=100)
    price_per_month = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)
    features = models.TextField(
        help_text="One feature per line; used for bullet list on pricing section."
    )
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "price_per_month"]

    def feature_list(self) -> list[str]:
        return [f.strip() for f in self.features.splitlines() if f.strip()]

    def __str__(self) -> str:
        return f"{self.name} (₹{self.price_per_month}/month)"


class Trainer(TimeStampedModel):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, default="Certified Trainer")
    bio = models.TextField(blank=True)
    specialty = models.CharField(
        max_length=200,
        blank=True,
        help_text="e.g. Strength & Conditioning, Zumba, Yoga",
    )
    experience_years = models.PositiveIntegerField(default=0)
    photo = models.ImageField(upload_to="trainers/", blank=True, null=True)
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name


class Testimonial(TimeStampedModel):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.rating}★)"


class HeroSlide(TimeStampedModel):
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=250, blank=True)
    button_label = models.CharField(max_length=80, default="Join Now")
    button_url = models.CharField(
        max_length=200, default="#contact", help_text="Anchor or full URL."
    )
    background_image = models.ImageField(
        upload_to="hero_slides/", blank=True, null=True
    )
    overlay_color = models.CharField(
        max_length=20,
        default="bg-black/60",
        help_text="Tailwind class used as overlay (e.g. bg-black/60).",
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title


class ContactSubmission(TimeStampedModel):
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField(blank=True)
    source_page = models.CharField(max_length=50, default="contact")
    sent_to_telegram = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.full_name} - {self.created_at:%Y-%m-%d}"


class FAQ(TimeStampedModel):
    question = models.CharField(max_length=200)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.question


class SiteSetting(models.Model):
    site_name = models.CharField(max_length=150, default="FitForge Wellness Club")
    tagline = models.CharField(
        max_length=200,
        default="Crush limits. Build strength. Own your transformation.",
    )
    phone_primary = models.CharField(max_length=30, blank=True)
    phone_secondary = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    address_line = models.CharField(max_length=250, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    google_maps_embed_url = models.URLField(
        blank=True,
        max_length=1000,
        help_text="Paste the full Google Maps embed URL for the Contact page map.",
    )
    telegram_bot_token = models.CharField(
        max_length=255,
        blank=True,
        help_text="Bot token used to send Contact messages to Telegram.",
    )
    telegram_chat_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Chat ID or channel ID that should receive Contact messages.",
    )

    class Meta:
        verbose_name = "Site setting"
        verbose_name_plural = "Site settings"

    def __str__(self) -> str:
        return "Global Site Settings"
