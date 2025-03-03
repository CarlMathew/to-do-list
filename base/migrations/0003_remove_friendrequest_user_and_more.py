# Generated by Django 5.1.5 on 2025-02-11 09:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_profile_is_online_friendrequest'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friendrequest',
            name='user',
        ),
        migrations.AddField(
            model_name='friendrequest',
            name='user_follower',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='following_request', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='friendrequest',
            name='user_following',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='follower_request', to=settings.AUTH_USER_MODEL),
        ),
    ]
