from django.urls import path
from . import views
urlpatterns = [
    path('', views.index),
    # path('update_currency', views.update_currency),
    path('time', views.time),
    path('click', views.click),
    path('time_update_currency', views.time_update_currency),
    path('time_update_upgrade', views.time_update_upgrade),
    path('time_update_building', views.time_update_building),
    path('page_reload_time', views.page_reload_time),
    path('time_update_upgrade', views.time_update_upgrade),
    path('change_money', views.change_money),
    path('begin', views.begin),
]
