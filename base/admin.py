from django.contrib import admin
from .models import Profile, Cateogry, Task, FriendRequest
# Register your models here.
admin.site.register(Profile)
admin.site.register(Cateogry)
admin.site.register(Task)
admin.site.register(FriendRequest)