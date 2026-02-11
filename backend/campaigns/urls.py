from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, dashboard_stats, news_inspiration

router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
    path('news/', news_inspiration, name='news-inspiration'),
]
