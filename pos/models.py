from django.db import models

# Create your models here.

class Item(models.Model):
    creation = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100)
    cost = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    srp = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    margin = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-modified']

    def __str__(self):
        return(self.name)
