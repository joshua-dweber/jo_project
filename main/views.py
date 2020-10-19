from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import User, Time_Upgrade

def index(request):
    if 'user_id' not in request.session:
        User.objects.create(jocoin=0, usd=0)
        request.session['user_id'] = User.objects.last().id
    return render(request, 'index.html')

def time(request):
    context = {
        "current_user": User.objects.get(id=request.session['user_id']),
    }
    return render(request, 'time.html', context)

def click(request):
    return render(request, 'click.html')

def time_update_currency(request):
    user = User.objects.get(id=request.session['user_id'])
    total_change = 0
    for upgrade in user.upgrades.all():
        total_change += upgrade.num
    user.jocoin += total_change
    user.save()
    return JsonResponse({'jocoin': user.jocoin})

def time_update_upgrade(request):
    upgrade_id = int(request.POST.get("upgrade_id", None))
    user = User.objects.get(id=request.session['user_id'])
    # for i in range(user.upgrades.all()):
    #     if user.upgrades.all()[i].upgrade_id == upgrade_id:
    #         return JsonResponse({})
    if upgrade_id == 0:
        Time_Upgrade.objects.create(
            upgrade_id=0,
            name="start",
            num=1,
            enabled=True,
            user=User.objects.get(id=request.session['user_id']),
        )
    elif upgrade_id == 1 and user.jocoin > 25:
        Time_Upgrade.objects.create(
            upgrade_id=1,
            name="+1",
            num=1,
            enabled=True,
            user=User.objects.get(id=request.session['user_id']),
        )
        user.jocoin -= 25
    elif upgrade_id == 2 and user.jocoin > 100:
        Time_Upgrade.objects.create(
            upgrade_id=2,
            name="+3",
            num=3,
            enabled=True,
            user=User.objects.get(id=request.session['user_id']),
        )
        user.jocoin -= 100
    elif upgrade_id == 3 and user.jocoin > 1000:
        Time_Upgrade.objects.create(
            upgrade_id=3,
            name="+5",
            num=5,
            enabled=True,
            user=User.objects.get(id=request.session['user_id']),
        )
        user.jocoin -= 1000
    elif upgrade_id == 4 and user.jocoin > 10000:
        Time_Upgrade.objects.create(
            upgrade_id=4,
            name="+15",
            num=15,
            enabled=True,
            user=User.objects.get(id=request.session['user_id']),
        )
        user.jocoin -= 10000
    elif upgrade_id == 5 and user.jocoin > 50000:
        Time_Upgrade.objects.create(
            upgrade_id=5,
            name="+25",
            num=25,
            enabled=True,
            user=User.objects.get(id=request.session['user_id']),
        )
        user.jocoin -= 50000
    user.save()
    return JsonResponse({})
