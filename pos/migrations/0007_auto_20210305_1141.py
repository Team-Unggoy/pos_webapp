# Generated by Django 3.1.3 on 2021-03-05 03:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0006_auto_20210109_1311'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchaseorder',
            name='posting_datetime',
            field=models.DateTimeField(blank=True, default=None),
        ),
        migrations.AlterField(
            model_name='purchaseorder',
            name='status',
            field=models.CharField(choices=[('0', 'Draft'), ('1', 'Complete'), ('2', 'Cancelled')], default=0, max_length=10),
        ),
    ]
