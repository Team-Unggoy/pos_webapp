# Generated by Django 3.1.3 on 2021-04-15 09:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salesinvoiceitem',
            name='sales_invoice_number',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.salesinvoice'),
        ),
    ]
