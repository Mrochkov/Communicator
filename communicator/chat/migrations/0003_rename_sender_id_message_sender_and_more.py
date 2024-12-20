# Generated by Django 5.0.3 on 2024-11-17 21:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0002_rename_conversation_message_conversation"),
    ]

    operations = [
        migrations.RenameField(
            model_name="message",
            old_name="sender_id",
            new_name="sender",
        ),
        migrations.AlterField(
            model_name="message",
            name="conversation",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="messages",
                to="chat.conversation",
            ),
        ),
    ]
