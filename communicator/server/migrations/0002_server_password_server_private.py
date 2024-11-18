# Generated by Django 5.0.3 on 2024-11-18 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("server", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="server",
            name="password",
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
        migrations.AddField(
            model_name="server",
            name="private",
            field=models.BooleanField(default=False),
        ),
    ]
