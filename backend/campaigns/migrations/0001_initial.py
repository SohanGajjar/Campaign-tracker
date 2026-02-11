from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True, default='')),
                ('platform', models.CharField(
                    choices=[
                        ('instagram', 'Instagram'), ('facebook', 'Facebook'),
                        ('twitter', 'Twitter / X'), ('linkedin', 'LinkedIn'),
                        ('tiktok', 'TikTok'), ('youtube', 'YouTube'), ('other', 'Other'),
                    ],
                    default='instagram', max_length=50
                )),
                ('status', models.CharField(
                    choices=[
                        ('draft', 'Draft'), ('scheduled', 'Scheduled'), ('active', 'Active'),
                        ('paused', 'Paused'), ('completed', 'Completed'), ('cancelled', 'Cancelled'),
                    ],
                    default='draft', max_length=50
                )),
                ('budget', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('target_audience', models.CharField(blank=True, default='', max_length=200)),
                ('content', models.TextField(blank=True, default='')),
                ('scheduled_date', models.DateField(blank=True, null=True)),
                ('tags', models.CharField(blank=True, default='', max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
