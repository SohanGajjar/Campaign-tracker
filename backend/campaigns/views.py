import requests
from django.conf import settings
from django.db.models import Count, Sum, Avg
from django.db.models.functions import TruncMonth
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Campaign
from .serializers import CampaignSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for Campaigns.
    GET    /api/campaigns/         - list all
    POST   /api/campaigns/         - create
    GET    /api/campaigns/{id}/    - retrieve
    PUT    /api/campaigns/{id}/    - update
    PATCH  /api/campaigns/{id}/    - partial update
    DELETE /api/campaigns/{id}/    - delete
    """
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    def get_queryset(self):
        queryset = Campaign.objects.all()
        platform = self.request.query_params.get('platform')
        status_filter = self.request.query_params.get('status')
        if platform:
            queryset = queryset.filter(platform=platform)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


@api_view(['GET'])
def dashboard_stats(request):
    """
    GET /api/dashboard/
    Returns aggregated stats for visualization.
    """
    total = Campaign.objects.count()
    total_budget = Campaign.objects.aggregate(total=Sum('budget'))['total'] or 0
    avg_budget = Campaign.objects.aggregate(avg=Avg('budget'))['avg'] or 0

    # Status breakdown
    status_counts = list(
        Campaign.objects.values('status')
        .annotate(count=Count('id'))
        .order_by('status')
    )

    # Platform breakdown
    platform_counts = list(
        Campaign.objects.values('platform')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    # Budget by platform
    budget_by_platform = list(
        Campaign.objects.values('platform')
        .annotate(total_budget=Sum('budget'))
        .order_by('-total_budget')
    )

    # Monthly campaign creation trend
    monthly_trend = list(
        Campaign.objects.annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )
    monthly_trend_formatted = [
        {'month': entry['month'].strftime('%b %Y'), 'count': entry['count']}
        for entry in monthly_trend
    ]

    return Response({
        'total_campaigns': total,
        'total_budget': float(total_budget),
        'avg_budget': float(avg_budget),
        'status_breakdown': status_counts,
        'platform_breakdown': platform_counts,
        'budget_by_platform': [
            {**b, 'total_budget': float(b['total_budget'])} for b in budget_by_platform
        ],
        'monthly_trend': monthly_trend_formatted,
    })


@api_view(['GET'])
def news_inspiration(request):
    """
    GET /api/news/?q=<query>&platform=<platform>
    Fetches trending news headlines from NewsAPI for campaign content inspiration.
    """
    query = request.query_params.get('q', 'social media marketing')
    api_key = settings.NEWS_API_KEY

    if not api_key:
        # Return mock data if no API key is configured
        return Response({
            'status': 'mock',
            'message': 'Configure NEWS_API_KEY in .env for live news.',
            'articles': [
                {
                    'title': 'How Short-Form Video is Dominating Social Media in 2025',
                    'description': 'Brands leveraging TikTok and Reels see 3x engagement over static posts.',
                    'url': 'https://newsapi.org',
                    'source': 'Marketing Weekly',
                    'publishedAt': '2025-01-15T10:00:00Z',
                },
                {
                    'title': 'AI-Powered Content Creation Trends for Q2',
                    'description': 'Marketers are turning to AI tools to scale content production.',
                    'url': 'https://newsapi.org',
                    'source': 'Digital Trends',
                    'publishedAt': '2025-01-14T08:00:00Z',
                },
                {
                    'title': 'Influencer Marketing Spend Hits $24B Globally',
                    'description': 'Micro-influencers deliver higher ROI than mega influencers for most brands.',
                    'url': 'https://newsapi.org',
                    'source': 'Ad Week',
                    'publishedAt': '2025-01-13T12:00:00Z',
                },
                {
                    'title': 'LinkedIn B2B Campaigns See Record Engagement Rates',
                    'description': 'Thought leadership content outperforms promotional posts on LinkedIn.',
                    'url': 'https://newsapi.org',
                    'source': 'B2B Magazine',
                    'publishedAt': '2025-01-12T09:00:00Z',
                },
            ]
        })

    url = 'https://newsapi.org/v2/everything'
    params = {
        'q': query,
        'language': 'en',
        'sortBy': 'publishedAt',
        'pageSize': 6,
        'apiKey': api_key,
    }

    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        articles = [
            {
                'title': a.get('title'),
                'description': a.get('description'),
                'url': a.get('url'),
                'source': a.get('source', {}).get('name'),
                'publishedAt': a.get('publishedAt'),
            }
            for a in data.get('articles', [])
        ]
        return Response({'status': 'live', 'articles': articles})
    except requests.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
