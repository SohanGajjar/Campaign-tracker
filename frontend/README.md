# 🎨 Campaign Tracker — Frontend

React (Vite) frontend for the Social Booster Media Campaign Tracker.

## Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS** — styling
- **Recharts** — data visualization
- **Axios** — API calls
- **react-hot-toast** — notifications

---

## Local Setup

### 1. Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8000`

### 2. Install
```bash
git clone https://github.com/your-username/campaign-tracker-frontend.git
cd campaign-tracker-frontend
npm install
```

### 3. Environment variables
```bash
cp .env.example .env
# For local dev, leave VITE_API_URL empty (Vite proxies /api → localhost:8000)
```

### 4. Run development server
```bash
npm run dev
# App at http://localhost:5173
```

### 5. Build for production
```bash
npm run build
```

---

## Application Pages

### 📋 Campaigns (`/` → default view)
Full CRUD interface for managing campaigns.
- **Create:** Click "New Campaign" button
- **View:** Click "View" on any row to see details
- **Edit:** Click "Edit" to open the edit modal
- **Delete:** Click "Delete" → confirm in dialog
- Filter by platform and status

### 📊 Dashboard
Analytics and reporting:
- KPI cards: total campaigns, total budget, avg budget, active count
- **Pie chart:** Campaign status breakdown
- **Bar chart:** Campaigns by platform
- **Horizontal bar:** Budget by platform
- **Line chart:** Campaign creation trend over time

### 📰 News Feed (Third-Party API)
Content inspiration via NewsAPI:
- Search marketing news by keyword
- Quick-filter tags (instagram trends, influencer marketing, etc.)
- Copy headlines to clipboard for campaign inspiration

---

## Deployment (Vercel)

### Steps:
1. Push code to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. Deploy — Vercel builds with `npm run build` automatically
5. `vercel.json` handles SPA routing

### Alternative: Netlify
1. Connect repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add `VITE_API_URL` in environment variables

---

## How to Test

### CRUD Flow (step-by-step):
1. Open the live URL
2. **Create:** Click "New Campaign" → fill form → "Create Campaign"
3. **View:** Click "View" on a row to see full campaign details
4. **Edit:** Click "Edit" → modify fields → "Save Changes"
5. **Delete:** Click "Delete" → confirm in dialog
6. Use platform/status filters to filter the list

### Dashboard / Visualization:
- Click **"📊 Dashboard"** in the nav
- Charts update immediately when CRUD data changes
- Create a few campaigns with different statuses/platforms to populate charts

### Third-Party API (NewsAPI):
- Click **"📰 News Feed"** in the nav
- Search defaults to "social media marketing"
- Click quick-filter tags or type a custom query
- Click "Read article ↗" to open the full article
- Click "📋 Copy headline" to copy to clipboard

---

## Project Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── campaigns.js      # Axios API calls
│   ├── components/
│   │   ├── CampaignList.jsx  # List + View + Delete
│   │   ├── CampaignForm.jsx  # Create + Edit modal
│   │   ├── Dashboard.jsx     # Charts & analytics
│   │   └── NewsInspiration.jsx # NewsAPI integration
│   ├── App.jsx               # Navigation shell
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind + custom styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── .env.example
```
