from django.db import models


class Campaign(models.Model):
    PLATFORM_CHOICES = [
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter / X'),
        ('linkedin', 'LinkedIn'),
        ('tiktok', 'TikTok'),
        ('youtube', 'YouTube'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES, default='instagram')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    target_audience = models.CharField(max_length=200, blank=True, default='')
    content = models.TextField(blank=True, default='')
    scheduled_date = models.DateField(null=True, blank=True)
    tags = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
