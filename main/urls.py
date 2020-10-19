from django.urls import path
from . import views
urlpatterns = [
    path('', views.index),
    # path('update_currency', views.update_currency),
    path('time', views.time),
    path('click', views.click),
    path('time_update_currency', views.time_update_currency),
    path('time_update_upgrade', views.time_update_upgrade),
]
