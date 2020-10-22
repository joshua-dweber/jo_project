from django.db import models

class User(models.Model):
    jocoin = models.DecimalField(max_digits=100,decimal_places=3)
    usd = models.DecimalField(max_digits=100,decimal_places=3)
    monay_rate = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# class Upgrade(models.Model):
#     upgrade_id = models.IntegerField()
#     name = models.CharField(max_length=255)#
#     desc = models.TextField()
#     num = models.DecimalField(max_digits=100,decimal_places=2)
#     enabled = models.BooleanField()
#     user = models.ForeignKey(User, related_name="upgrades", on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

class Time_Building(models.Model):
    building_id = models.IntegerField()
    name = models.CharField(max_length=255)
    enabled = models.BooleanField()
    num = models.DecimalField(max_digits=100,decimal_places=3)
    user = models.ForeignKey(User, related_name="time_buildings", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Time_Upgrade(models.Model):
    upgrade_id = models.IntegerField()
    enabled = models.BooleanField()
    num = models.DecimalField(max_digits=100, decimal_places=3)
    building = models.ForeignKey(Time_Building, related_name="time_upgrades", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Click_Building(models.Model):
    building_id = models.IntegerField()
    name = models.CharField(max_length=255)
    enabled = models.BooleanField()
    num = models.DecimalField(max_digits=100, decimal_places=3)
    user = models.ForeignKey(User, related_name="click_buildings", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Click_Upgrade(models.Model):
    upgrade_id = models.IntegerField()
    enabled = models.BooleanField()
    num = models.DecimalField(max_digits=100, decimal_places=3)
    building = models.ForeignKey(Click_Building, related_name="click_upgrades", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
