# Generated by Django 3.1.3 on 2021-04-15 09:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=100)),
                ('barcode_number', models.CharField(blank=True, max_length=13)),
                ('enable', models.BooleanField(default=True)),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('srp', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('supplier', models.CharField(blank=True, max_length=100)),
            ],
            options={
                'ordering': ['-modified'],
            },
        ),
        migrations.CreateModel(
            name='PurchaseOrder',
            fields=[
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('posting_datetime', models.DateTimeField(blank=True)),
                ('purchase_order_number', models.CharField(blank=True, default=None, max_length=255, primary_key=True, serialize=False)),
                ('supplier', models.CharField(blank=True, default=None, max_length=100)),
                ('status', models.CharField(blank=True, default='Draft', max_length=100)),
                ('is_received', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['-modified'],
            },
        ),
        migrations.CreateModel(
            name='PurchaseReceipt',
            fields=[
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('posting_datetime', models.DateTimeField(blank=True)),
                ('purchase_receipt_number', models.CharField(blank=True, default=None, max_length=255, primary_key=True, serialize=False)),
                ('supplier', models.CharField(max_length=100)),
                ('status', models.CharField(default='None', max_length=100)),
                ('invoice_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('purchase_order_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.purchaseorder')),
            ],
            options={
                'ordering': ['-modified'],
            },
        ),
        migrations.CreateModel(
            name='SalesInvoice',
            fields=[
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('posting_datetime', models.DateTimeField(blank=True, default=None)),
                ('sales_invoice_number', models.CharField(blank=True, default=None, max_length=255, primary_key=True, serialize=False)),
                ('status', models.CharField(blank=True, default='Draft', max_length=100)),
                ('costumer', models.CharField(blank=True, default=None, max_length=100)),
                ('sales_invoice', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
            ],
            options={
                'ordering': ['-modified'],
            },
        ),
        migrations.CreateModel(
            name='StockTransaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('posting_datetime', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(default=None, max_length=100)),
                ('qty', models.IntegerField(default=0)),
                ('voucher_type', models.CharField(max_length=100)),
                ('voucher_no', models.CharField(max_length=100)),
                ('barcode_number', models.CharField(blank=True, default=None, max_length=13)),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='pos.item')),
            ],
        ),
        migrations.CreateModel(
            name='SalesInvoiceItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=100)),
                ('barcode_number', models.CharField(blank=True, max_length=13)),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('qty', models.IntegerField(default=0)),
                ('item', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='pos.item')),
                ('sales_invoice_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='pos.salesinvoice')),
            ],
        ),
        migrations.CreateModel(
            name='PurchaseReceiptItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=100)),
                ('barcode_number', models.CharField(blank=True, max_length=13)),
                ('qty', models.PositiveIntegerField(default=1)),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('item', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='pos.item')),
                ('purchase_order_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pos.purchaseorder')),
                ('purchase_receipt_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='pos.purchasereceipt')),
            ],
        ),
        migrations.CreateModel(
            name='PurchaseOrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=100)),
                ('barcode_number', models.CharField(blank=True, max_length=13)),
                ('qty', models.PositiveIntegerField(default=1)),
                ('cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('item', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='pos.item')),
                ('purchase_order_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='pos.purchaseorder')),
            ],
        ),
    ]
