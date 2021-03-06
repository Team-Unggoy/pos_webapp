# Generated by Django 3.1.3 on 2021-03-05 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0008_purchaseorder_supplier'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchaseorder',
            name='total',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]
