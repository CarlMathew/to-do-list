
from rest_framework import serializers
from .models import Task, Cateogry


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Cateogry
        fields = ["id", 'category_name']
    
    def create(self, validated_data):
        user = self.context['request'].user
        category = Cateogry.objects.create(
            user=user,
            category_name=validated_data['category_name']
        )
        return category
    

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "user", "category", "task_name", "time", "created_at"]
        read_only_fields = ["id", "created_at"]
    
    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)