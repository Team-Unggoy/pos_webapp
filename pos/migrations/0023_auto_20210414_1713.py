# Generated by Django 3.1.3 on 2021-04-14 09:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0022_stocktransaction_voucher_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='SalesInvoice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('posting_datetime', models.DateTimeField(blank=True, default=None)),
                ('costumer', models.CharField(blank=True, default=None, max_length=100)),
                ('invoice_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='SalesInvoiceItems',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('srp', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('qty', models.IntegerField(default=0)),
                ('sales_invoice_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.salesinvoice')),
            ],
        ),
        migrations.DeleteModel(
            name='Order',
        ),
        migrations.AlterField(
            model_name='stocktransaction',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='pos.item'),
        ),
    ]
