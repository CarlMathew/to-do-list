from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime
from django.utils import timezone
import uuid
# Create your models here.
User = get_user_model()


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    profile_pic = models.ImageField(upload_to="profile/", default="profile/default-img.jpg")

    def __str__(self):
        return f"Username: {self.username}"
    
class Cateogry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null = True)
    # category_id = models.AutoField(primary_key=True)  # Explicit primary key
    category_name = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.category_name

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null = True)
    #category = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='category_id')  # Explicit foreign key
    category = models.ForeignKey(Cateogry, on_delete=models.CASCADE)
    task_name = models.CharField(max_length=255)
    time = models.IntegerField(default=1)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.category}: {self.task_name}"
