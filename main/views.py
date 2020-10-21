from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import User, Time_Upgrade, Time_Building
import datetime as dt
from decimal import Decimal

time_buildings = {
    "0": {
        "num": 1,
        "cost": 1,
        "minimum": 0,
        "name": "Pan Handler"
    },
    "1": {
        "num": 25,
        "cost": 1000,
        "minimum": 1000,
        "name": "Teacher"
    },
    "2": {
        "num": 100,
        "cost": 10000,
        "minimum": 10000,
        "name" : "Accountant"
    },
    "3": {
        "num": 1000,
        "cost": 100000,
        "minimum": 100000,
        "name" : "Lawyer"
    },
    "4": {
        "num": 10000,
        "cost": 1000000,
        "minimum": 1000000,
        "name": "Mafia Boss"
    },
    "5": {
        "num": 100000,
        "cost": 100000000,
        "minimum": 100000000,
        "name" : "Owner of Multiple National Governments"
    },
}

time_upgrades = {
    "0": {
        "num": 0.2,
        "cost": 10, 
        "minimum": 12, 
        "name": "Upgrade 1",
    },
    "1": {
        "num": 0.3,
        "cost": 12,
        "minimum": 16,
        "name": "Upgrade 2",
    },
    "2": {
        "num": 0.4,
        "cost": 15,
        "minimum": 22,
        "name": "Upgrade 3",
    },
    "3": {
        "num": 0.5,
        "cost": 25,
        "minimum": 30,
        "name": "Upgrade 4",
    },
    "4": {
        "num": 0.6,
        "cost": 50,
        "minimum": 50,
        "name": "Upgrade 5",
    },
}

def index(request):
    if 'user_id' not in request.session:
        User.objects.create(jocoin=0, usd=0)
        request.session['user_id'] = User.objects.last().id
        request.session['last_updated'] = str(dt.datetime.now())
    return render(request, 'index.html')

def time(request):
    if 'user_id' not in request.session:
        return redirect('/')
    context = {
        "current_user": User.objects.get(id=request.session['user_id']),
    }
    return render(request, 'time.html', context)

def click(request):
    return render(request, 'click.html')

def page_reload_time(request):
    user = User.objects.get(id=request.session['user_id'])
    tb = None
    if user.time_buildings:
        tb = list(user.time_buildings.all())
        for i in range(len(tb)):
            tb[i] = model_to_dict(tb[i])
            tb[i]["upgrade_ids"] = []
            for j in user.time_buildings.all()[i].time_upgrades.all():
                tb[i]["upgrade_ids"].append(j.upgrade_id)
    return JsonResponse({
        'jocoin': user.jocoin,
        'buildings': tb,
    })

def time_update_currency(request):
    difference_seconds = (dt.datetime.now() - dt.datetime.strptime(request.session['last_updated'], '%Y-%m-%d %H:%M:%S.%f')).total_seconds()
    print(difference_seconds)
    request.session['last_updated'] = str(dt.datetime.now())
    user = User.objects.get(id=request.session['user_id'])
    total_change = 0
    for building in user.time_buildings.all():
        upgrade_num = 1
        for upgrade in building.time_upgrades.all():
            upgrade_num += upgrade.num
        total_change += building.num * upgrade_num
    user.jocoin += total_change * Decimal(difference_seconds)
    user.save()
    return JsonResponse({'jocoin': user.jocoin, 'increase_rate': (total_change / 10)})

def time_update_building(request):
    building_id = request.POST.get("building_id", None)
    user = User.objects.get(id=request.session['user_id'])
    if building_id not in time_buildings or user.time_buildings.filter(building_id=building_id):
        return JsonResponse({})
    if user.jocoin >= time_buildings[building_id]["minimum"]:
        Time_Building.objects.create(
            building_id=building_id,
            name=time_buildings[building_id]["name"],
            num=time_buildings[building_id]["num"],
            enabled=True,
            user=user,
        )
        user.jocoin -= time_buildings[building_id]["cost"]
        print("building added")
        user.save()
        return JsonResponse({"status": 1})
    return JsonResponse({"status": 0})

def time_update_upgrade(request):
    building_id = request.POST.get("building_id", None)
    upgrade_id = request.POST.get("upgrade_id", None)
    user = User.objects.get(id=request.session['user_id'])
    building = user.time_buildings.filter(building_id=building_id)[0]
    if upgrade_id not in time_upgrades or building.time_upgrades.filter(upgrade_id=upgrade_id):
        return JsonResponse({})
    if user.jocoin >= time_buildings[building_id]["cost"] * time_upgrades[upgrade_id]["minimum"]:
        Time_Upgrade.objects.create(
            upgrade_id=upgrade_id,
            name=time_upgrades[upgrade_id]["name"],
            num=time_upgrades[upgrade_id]["num"],
            enabled=True,
            building=building,
        )
        user.jocoin -= building.num * time_upgrades[upgrade_id]["cost"]
        print("upgrade added")
        user.save()
        return JsonResponse({"status": 1})
    return JsonResponse({"status": 0})

def change_money(request):
    user = User.objects.get(id=request.session['user_id'])
    user.jocoin = request.POST['money']
    user.save()
    return redirect('/time')

def begin(request):
    user = User.objects.get(id=request.session['user_id'])
    user.jocoin += 1
    user.save()
    return JsonResponse({})
