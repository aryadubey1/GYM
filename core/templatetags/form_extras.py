from django import template

register = template.Library()


@register.filter(name="add_class")
def add_class(field, css_class: str):
    """
    Add CSS classes to a form field widget in templates.
    Usage: {{ field|add_class:"your-css" }}
    """
    widget = field.field.widget
    existing = widget.attrs.get("class", "")
    widget.attrs["class"] = (existing + " " + css_class).strip()
    return field

