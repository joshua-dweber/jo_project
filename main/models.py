from django.db import models

class User(models.Model):
    jocoin = models.BigIntegerField()
    usd = models.BigIntegerField()
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

class Time_Upgrade(models.Model):
    upgrade_id = models.IntegerField()
    name = models.CharField(max_length=255)
    desc = models.TextField()
    enabled = models.BooleanField()
    num = models.DecimalField(max_digits=100,decimal_places=2)
    user = models.ForeignKey(User, related_name="upgrades", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
