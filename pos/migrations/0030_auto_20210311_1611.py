# Generated by Django 3.1.3 on 2021-03-11 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0029_auto_20210311_1609'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchaseorder',
            name='total',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
