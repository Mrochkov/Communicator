# Generated by Django 5.0.3 on 2024-11-20 16:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0004_rename_sender_message_sender_id_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="message",
            old_name="sender_id",
            new_name="sender",
        ),
    ]