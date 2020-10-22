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
    path('change_money_time', views.change_money_time),
    path('change_money_click', views.change_money_click),
    path('begin', views.begin),
    path('click_update_currency', views.click_update_currency),
    path('click_update_building', views.click_update_building),
    path('click_update_upgrade', views.click_update_upgrade),
    path('page_reload_click', views.page_reload_click),
    path('is_rich_enough', views.is_rich_enough),
    path('haxor', views.haxor),
]
