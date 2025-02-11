from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import CategorySerializer, TaskSerializer
from .models import Profile, Cateogry, Task, FriendRequest
from rest_framework.response import Response
from django.db.models import Q
import json
# Create your views here.


@api_view(["GET"])
def get_category(request):
    category_id = request.GET.get("id")
    print("category_id", category_id)
    categories = Cateogry.objects.filter(user = request.user).values()
    return Response(categories, status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_task(request):
    data = request.GET.get("id")
    specified_task = Task.objects.filter(category__id = int(data))
    serializer = TaskSerializer(specified_task, many = True)
    return Response(serializer.data, status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_category(request):
    serializer = CategorySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        category = serializer.save(user=request.user)
        return Response({"message":"Successfully Created", "category": serializer.data}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    serializer = TaskSerializer(data = request.data, context = {'request': request})

    if serializer.is_valid():
        serializer.save(user= request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_friend(request):
    user_id = request.query_params.get("user_id")

    if not user_id:
        raise ValueError({"Please provide the user id"})
    
    try:
        user_following = User.objects.get(id = int(user_id))
        profile = Profile.objects.get(user=user_following)
        new_add_friend = FriendRequest.objects.create(user_follower = request.user, 
                                                      user_following = user_following, 
                                                      profile = profile)
        new_add_friend.save()
        return Response({"message": "Added"}, status = status.HTTP_200_OK)

    except:
        return Response({"error": "Internal Server Error"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_task(request,id):
    print(id)
    try:
        task = Task.objects.get(user = request.user, id = id)
        print(task)
    except Task.DoesNotExist():
        return Response({'error': "Task does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TaskSerializer(task, data = request.data, partial = True, context = {"request": request})

    if serializer.is_valid():
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    
    return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteTask(request):
    task_id = dict(request.data)["id"][0]
    print(task_id)
    try:

        task = Task.objects.filter(id = int(task_id), user = request.user)
    except Task.DoesNotExist():
        return Response({"error": "Task Does not exist"}, status=status.HTTP_404_NOT_FOUND)
    task.delete()
    return Response({"message": "Task deleted completely"}, status=status.HTTP_202_ACCEPTED)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def removeFriend(request):
    user_id = int(request.query_params.get("user_id"))
    if not user_id:
        return Response({"message": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:  
        remove_friend = FriendRequest.objects.filter(Q(user_follower = request.user) & Q(user_following = user_id))
        if remove_friend.exists():
            remove_friend.delete()
            return Response({"message": "Successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Friend Request Not Found"}, status = status.HTTP_404_NOT_FOUND)
    except:
        return Response({"message": "Internal Error Server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@login_required(login_url="/listdo/login")
def home(request):
    profile = Profile.objects.get(user = request.user)
    access_token = request.session.get("access_token")
    username = request.session.get("username")
    password = request.session.get("password")
    categories = Cateogry.objects.filter(user = request.user)
    users = Profile.objects.select_related("user").all()
    friend_request = FriendRequest.objects.filter(user_follower = request.user).values()
    added = [i["user_following_id"] for i in friend_request]
  
    first_category = None
    first_pk = None
    first_task = None
    tasks = None
    work_task = None
    taskCount = 0
    work_task_count = 0
    if len(categories) != 0:
        first_category = categories[0]
        first_pk = first_category.pk
        first_task = first_category.category_name
        tasks = Task.objects.filter(category = first_category)
        work_task = Task.objects.filter(category__id = first_pk)
        taskCount = len(tasks)
        work_task_count = len(work_task)

    return render(request, "base/home.html", {
        "user": profile,
        "categories": categories,
        "first_category": first_category,
        "first_pk": first_pk,
        "first_name": first_task,
        "access_token": access_token,
        "user_details": json.dumps({
            "username": username,
            "password": password
        }),
        "tasks": tasks,
        "total_task": work_task_count,
        "taskCount": taskCount,
        "suggested_friends": users,
        "added": added
    })


def login_form(request):
    return render(request, "base/index.html")

def login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = auth.authenticate(username = username, password = password)


        if user is not None:
            # response = requests.post("http://localhost:8000/listdo/api/token/", json={
            #     "username": username,
            #     "password": password
            # })
            # access_token = response.json().get("access", None)
            # request.session["access_token"] = access_token

            request.session["username"] = username
            request.session["password"] = password
            
            auth.login(request, user)
            return redirect("/listdo/home")
        else:
            messages.info(request, "Credentials Invalid")
            return redirect("/listdo/login")


def signup(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        print(password)
        if User.objects.filter(username = username).exists():
            messages.info(request, "Username Already Taken!")
            return redirect("/listdo/login")
        elif User.objects.filter(email = email).exists():
            messages.info(request, "Email Already Taken!")
            return redirect("/listdo/login")
        else: 
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            user_login = auth.authenticate(username = username, password = password)
            auth.login(request, user_login)
            user_model = User.objects.get(username = username)
            profile_model = Profile.objects.create(user = user_model, username = username)
            profile_model.save()
            request.session["username"] = username
            request.session["password"] = password
            return redirect("/listdo/home")

def logout(request):
    auth.logout(request)
    return redirect("/listdo/login")
        

  
