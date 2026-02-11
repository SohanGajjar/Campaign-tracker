import { useState } from 'react'
import CampaignList from './components/CampaignList'
import Dashboard from './components/Dashboard'
import NewsInspiration from './components/NewsInspiration'

const NAV = [
  { id: 'campaigns', label: '📋 Campaigns', title: 'Campaign Tracker' },
  { id: 'dashboard', label: '📊 Dashboard', title: 'Analytics Dashboard' },
  { id: 'news', label: '📰 News Feed', title: 'Content Inspiration' },
]

export default function App() {
  const [page, setPage] = useState('campaigns')
  const [menuOpen, setMenuOpen] = useState(false)

  const current = NAV.find(n => n.id === page)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <div className="font-bold text-gray-900 leading-tight">Social Booster</div>
              <div className="text-xs text-gray-500 leading-tight">Campaign Tracker</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex gap-1">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === n.id
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => { setPage(n.id); setMenuOpen(false) }}
                className={`block w-full text-left px-4 py-3 text-sm font-medium ${
                  page === n.id ? 'bg-sky-50 text-sky-700' : 'text-gray-600'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Page header */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold">{current?.title}</h1>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {page === 'campaigns' && <CampaignList />}
        {page === 'dashboard' && <Dashboard />}
        {page === 'news' && <NewsInspiration />}
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        Social Booster Media — Campaign Tracker © 2025
      </footer>
    </div>
  )
}
