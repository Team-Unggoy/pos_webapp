# Generated by Django 3.1.3 on 2021-03-11 06:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0026_auto_20210311_1436'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='purchaseorderitem',
            name='key',
        ),
        migrations.RemoveField(
            model_name='purchaseorderitem',
            name='total',
        ),
    ]
