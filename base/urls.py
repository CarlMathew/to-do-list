from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name = "token_refresh"),
    path("login", view=views.login_form),
    path("signup", view=views.signup),
    path("signin", view = views.login),
    path("home", view = views.home),
    path('logout', view=views.logout),
    path("api/getCategory/", views.get_category),
    path("api/getTask/", views.get_task),
    path("api/createCategory/", views.create_category),
    path("api/createTask/", views.create_task),
    path("api/deleteTask/", views.deleteTask),
    path("api/updateTask/<str:id>", view=views.update_task),
    path("api/addFriend/",  view=views.add_friend),
    path("api/unfriend/", view = views.removeFriend)

]
