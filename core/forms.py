from django import forms

from .models import ContactSubmission


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactSubmission
        fields = ["full_name", "email", "phone", "message"]
        widgets = {
            "full_name": forms.TextInput(attrs={"autocomplete": "name", "placeholder": "Priya Sharma"}),
            "email": forms.EmailInput(attrs={"autocomplete": "email", "spellcheck": "false", "placeholder": "you@example.com"}),
            "phone": forms.TextInput(attrs={"type": "tel", "inputmode": "tel", "autocomplete": "tel", "placeholder": "98765 43210"}),
            "message": forms.Textarea(attrs={"rows": 4, "autocomplete": "off", "placeholder": "Lose 8 kg before March, learn to box…"}),
        }
