from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import User, Time_Upgrade, Time_Building, Click_Upgrade, Click_Building
import datetime as dt
from decimal import Decimal
from . import dictionaries


def index(request):
    if 'user_id' not in request.session:
        User.objects.create(jocoin=0, usd=0, monay_rate=1)
        request.session['user_id'] = User.objects.last().id
        request.session['last_updated'] = str(dt.datetime.now())
        request.session['click_last_updated'] = str(dt.datetime.now())
    user = User.objects.get(id=request.session['user_id'])
    context = {
        "is_rich_enough": False,
        "current_user": User.objects.get(id=request.session['user_id']),
    }
    if user.jocoin >= 100000000 and user.usd >= 100000000:
        context['is_rich_enough'] = True
        return render(request, 'index.html', context)
    return render(request, 'index.html', context)

def is_rich_enough(request):
    user = User.objects.get(id=request.session['user_id'])
    if user.jocoin > 100000000 and user.usd > 100000000:
        user.jocoin -= 100000000
        user.usd -= 100000000
        user.monay_rate += Decimal(0.1)
        user.save()
    return JsonResponse({})

def time(request):
    if 'user_id' not in request.session:
        return redirect('/')
    context = {
        "current_user": User.objects.get(id=request.session['user_id']),
    }
    return render(request, 'time.html', context)

def click(request):
    if 'user_id' not in request.session:
        return redirect('/')
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
        'time_buildings': dictionaries.time_buildings,
        'time_upgrades': dictionaries.time_upgrades,
    })

def time_update_currency(request):
    difference_seconds = (dt.datetime.now() - dt.datetime.strptime(request.session['last_updated'], '%Y-%m-%d %H:%M:%S.%f')).total_seconds()
    request.session['last_updated'] = str(dt.datetime.now())
    total_change = 0
    user = User.objects.get(id=request.session['user_id'])
    for building in user.time_buildings.all():
        upgrade_num = 1
        for upgrade in building.time_upgrades.all():
            upgrade_num += upgrade.num
        total_change += building.num * upgrade_num * user.monay_rate
    if difference_seconds < 60:
        user.jocoin += total_change * Decimal(difference_seconds)
        user.save()
    return JsonResponse({'jocoin': user.jocoin, 'increase_rate': (total_change / 10)})

def time_update_building(request):
    building_id = request.POST.get("building_id", None)
    user = User.objects.get(id=request.session['user_id'])
    if building_id not in dictionaries.time_buildings or user.time_buildings.filter(building_id=building_id):
        return JsonResponse({"status": 0, "error": "Building doesn't exist or you have already bought it."})
    if user.jocoin >= dictionaries.time_buildings[building_id]["minimum"]:
        Time_Building.objects.create(
            building_id=building_id,
            name=dictionaries.time_buildings[building_id]["name"],
            num=dictionaries.time_buildings[building_id]["num"],
            enabled=True,
            user=user,
        )
        user.jocoin -= dictionaries.time_buildings[building_id]["cost"]
        print("building added")
        user.save()
        return JsonResponse({"status": 1})
    return JsonResponse({"status": 0, "error": "You don't have enough JoCoin to purchase this building."})

def time_update_upgrade(request):
    building_id = request.POST.get("building_id", None)
    upgrade_id = request.POST.get("upgrade_id", None)
    user = User.objects.get(id=request.session['user_id'])
    building = user.time_buildings.filter(building_id=building_id)[0]
    if upgrade_id not in dictionaries.time_upgrades or building.time_upgrades.filter(upgrade_id=upgrade_id):
        return JsonResponse({"status": 0, "error": "Upgrade doesn't exist or you have already bought it."})
    if user.jocoin >= dictionaries.time_buildings[building_id]["cost"] * dictionaries.time_upgrades[upgrade_id]["cost"]:
        Time_Upgrade.objects.create(
            upgrade_id=upgrade_id,
            num=dictionaries.time_upgrades[upgrade_id]["num"],
            enabled=True,
            building=building,
        )
        user.jocoin -= dictionaries.time_buildings[building_id]["cost"] * dictionaries.time_upgrades[upgrade_id]["cost"]
        print("upgrade added")
        user.save()
        return JsonResponse({"status": 1})
    return JsonResponse({"status": 0, "error": "You don't have enough JoCoin to purchase this upgrade."})

def change_money_time(request):
    user = User.objects.get(id=request.session['user_id'])
    user.jocoin = request.POST['money']
    user.save()
    return redirect('/time')

def change_money_click(request):
    user = User.objects.get(id=request.session['user_id'])
    user.usd = request.POST['money']
    user.save()
    return redirect('/click')

def begin(request):
    user = User.objects.get(id=request.session['user_id'])
    user.jocoin = 1
    user.save()
    return JsonResponse({})

def page_reload_click(request):
    user = User.objects.get(id=request.session['user_id'])
    tb = None
    if user.click_buildings:
        tb = list(user.click_buildings.all())
        for i in range(len(tb)):
            tb[i] = model_to_dict(tb[i])
            tb[i]["upgrade_ids"] = []
            for j in user.click_buildings.all()[i].click_upgrades.all():
                tb[i]["upgrade_ids"].append(j.upgrade_id)
    return JsonResponse({
        'usd': user.usd,
        'buildings': tb,
        'click_buildings': dictionaries.click_buildings,
        'click_upgrades': dictionaries.click_upgrades,
    })

def click_update_currency(request):
    difference_seconds = (dt.datetime.now() - dt.datetime.strptime(request.session['click_last_updated'], '%Y-%m-%d %H:%M:%S.%f')).total_seconds()
    request.session['click_last_updated'] = str(dt.datetime.now())
    total_change = 1
    user = User.objects.get(id=request.session['user_id'])
    clicks = int(request.POST.get("clicks", None))
    if ((clicks + 1)/ difference_seconds) > 15:
        return JsonResponse({'usd': user.usd, 'increase_rate': total_change, "status": 0, "error": "please dont cheat : )"})
    for building in user.click_buildings.all():
        upgrade_num = 1
        for upgrade in building.click_upgrades.all():
            upgrade_num += upgrade.num
        total_change += building.num * upgrade_num * user.monay_rate
    user.usd += total_change * int(request.POST.get("clicks", None))
    user.save()
    return JsonResponse({'usd': user.usd, 'increase_rate': total_change})

def haxor(request):
    return render(request, 'hacks.html')

def click_update_building(request):
    building_id = request.POST.get("building_id", None)
    user = User.objects.get(id=request.session['user_id'])
    if building_id not in dictionaries.click_buildings or user.click_buildings.filter(building_id=building_id):
        return JsonResponse({})
    user.save()
    return JsonResponse({'usd': user.usd, 'increase_rate': total_change})

def click_update_building(request):
    building_id = request.POST.get("building_id", None)
    user = User.objects.get(id=request.session['user_id'])
    if building_id not in dictionaries.click_buildings or user.click_buildings.filter(building_id=building_id):
        return JsonResponse({"status": 0, "error": "Building doesn't exist or you have already bought it."})
    if user.usd >= dictionaries.click_buildings[building_id]["minimum"]:
        Click_Building.objects.create(
            building_id=building_id,
            name=dictionaries.click_buildings[building_id]["name"],
            num=dictionaries.click_buildings[building_id]["num"],
            enabled=True,
            user=user,
        )
        user.usd -= dictionaries.click_buildings[building_id]["cost"]
        print("building added")
        user.save()
        return JsonResponse({"status": 1})
    return JsonResponse({"status": 0, "error": "You don't have enough USD to purchase this building."})

def click_update_upgrade(request):
    building_id = request.POST.get("building_id", None)
    upgrade_id = request.POST.get("upgrade_id", None)
    user = User.objects.get(id=request.session['user_id'])
    building = user.click_buildings.filter(building_id=building_id)[0]
    if upgrade_id not in dictionaries.click_upgrades or building.click_upgrades.filter(upgrade_id=upgrade_id):
        return JsonResponse({"status": 0, "error": "Upgrade doesn't exist or you have already bought it."})
    if user.usd >= dictionaries.click_buildings[building_id]["cost"] * dictionaries.click_upgrades[upgrade_id]["cost"]:
        Click_Upgrade.objects.create(
            upgrade_id=upgrade_id,
            num=dictionaries.click_upgrades[upgrade_id]["num"],
            enabled=True,
            building=building,
        )
        user.usd -= dictionaries.click_buildings[building_id]["cost"] * dictionaries.click_upgrades[upgrade_id]["cost"]
        print("upgrade added")
        user.save()
        return JsonResponse({"status": 1})
    return JsonResponse({"status": 0, "error": "You don't have enough USD to purchase this upgrade."})
