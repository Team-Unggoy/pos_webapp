# Generated by Django 3.1.3 on 2021-03-26 08:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0035_auto_20210325_1603'),
    ]

    operations = [
        migrations.CreateModel(
            name='PurchaseReceipt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('supplier', models.CharField(max_length=100)),
                ('status', models.CharField(default='None', max_length=100)),
                ('purchase_order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.purchaseorder')),
            ],
        ),
    ]