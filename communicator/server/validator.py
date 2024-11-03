import os.path

from PIL import Image
from django.core.exceptions import ValidationError
import os

def validate_image_size(image):
    if image:
        with Image.open(image) as img:
            if img.width > 180 or img.height > 180:
                raise ValidationError(
                    f"The maximum size of the image is 80x80 - your image size: {img.size}"
                )


def validate_image_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_file_extensions = [".jpg", ".png", ".jpeg", ".gif"]
    if not ext.lower() in valid_file_extensions:
        raise ValidationError("Unsupported file extension, use one of those: .jpeg, .jpg, .png, .gif")
