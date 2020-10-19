from django.shortcuts import render, redirect

def index(request):
    return render(request, 'index.html')


# def update_currency(request):
#     return JsonResponse("'change_currency': 5")