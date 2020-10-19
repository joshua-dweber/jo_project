from django.urls import path
from . import views
urlpatterns = [
    path('', views.index),
    # path('update_currency', views.update_currency),
]
