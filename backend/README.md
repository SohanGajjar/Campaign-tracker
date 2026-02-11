# 🚀 Campaign Tracker — Backend

Django REST Framework API for the Social Booster Media Campaign Tracker.

## Tech Stack
- **Python 3.11+** / Django 4.2
- **Django REST Framework** — REST API
- **PostgreSQL** — Primary database
- **Gunicorn** — Production WSGI server
- **WhiteNoise** — Static file serving
- **NewsAPI** — Third-party news integration

---

## Local Setup

### 1. Prerequisites
- Python 3.11+
- PostgreSQL running locally

### 2. Clone & install
```bash
git clone https://github.com/your-username/campaign-tracker-backend.git
cd campaign-tracker-backend

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

**Required `.env` variables:**
```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=campaign_tracker
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
NEWS_API_KEY=your_newsapi_key   # Free key at https://newsapi.org/
```

### 4. Database setup
```bash
# Create PostgreSQL database
createdb campaign_tracker

# Run migrations
python manage.py migrate

# (Optional) Create admin user
python manage.py createsuperuser
```

### 5. Run development server
```bash
python manage.py runserver
# API available at http://localhost:8000/api/
```

---

## REST API Reference

### Campaigns (Full CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/campaigns/` | List all campaigns |
| `POST` | `/api/campaigns/` | Create a campaign |
| `GET` | `/api/campaigns/{id}/` | Get single campaign |
| `PUT` | `/api/campaigns/{id}/` | Full update |
| `PATCH` | `/api/campaigns/{id}/` | Partial update |
| `DELETE` | `/api/campaigns/{id}/` | Delete campaign |

**Query params for list:** `?platform=instagram&status=active`

**Campaign payload:**
```json
{
  "title": "Summer Sale Launch",
  "platform": "instagram",
  "status": "scheduled",
  "budget": "1500.00",
  "target_audience": "18-34 year olds",
  "description": "Campaign overview",
  "content": "Post copy here",
  "scheduled_date": "2025-06-15",
  "tags": "summer, sale"
}
```

### Dashboard Stats
```
GET /api/dashboard/
```
Returns status breakdown, platform breakdown, budget aggregates, monthly trend.

### News Inspiration (Third-Party API)
```
GET /api/news/?q=social+media+marketing
```
Fetches trending articles from NewsAPI.

---

## Django Admin
Visit `/admin/` and log in with superuser credentials to manage campaigns via the admin interface.

---

## Deployment (Render)

### Steps:
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set:
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
4. Add a **PostgreSQL** database on Render
5. Set environment variables:
   ```
   DATABASE_URL=<from Render PostgreSQL>
   SECRET_KEY=<generate a strong key>
   DEBUG=False
   NEWS_API_KEY=<your key>
   ```
6. Render auto-runs `python manage.py migrate` via the `Procfile`

### Alternative: Railway
1. Connect repo → Railway auto-detects Python
2. Add PostgreSQL plugin
3. Set the same environment variables
4. Railway provides `DATABASE_URL` automatically

---

## How to Test

### CRUD via REST API (curl examples):
```bash
BASE=http://localhost:8000

# Create
curl -X POST $BASE/api/campaigns/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Campaign","platform":"instagram","status":"draft","budget":"500"}'

# List
curl $BASE/api/campaigns/

# Update
curl -X PUT $BASE/api/campaigns/1/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","platform":"facebook","status":"active","budget":"750"}'

# Patch status
curl -X PATCH $BASE/api/campaigns/1/ \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete
curl -X DELETE $BASE/api/campaigns/1/

# Dashboard
curl $BASE/api/dashboard/

# News
curl "$BASE/api/news/?q=instagram+marketing"
```

---

## Project Structure
```
backend/
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── campaigns/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── manage.py
├── requirements.txt
├── Procfile
└── .env.example
```
