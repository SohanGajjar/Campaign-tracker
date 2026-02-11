import { useState, useEffect, useRef } from 'react'
import { getNewsInspiration } from '../api/campaigns'

const SUGGESTED_QUERIES = [
  'social media marketing',
  'instagram trends',
  'influencer marketing',
  'digital advertising',
  'content marketing',
  'tiktok brands',
  'email marketing',
]

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function NewsInspiration() {
  const [query, setQuery] = useState('social media marketing')
  const [inputVal, setInputVal] = useState('social media marketing')
  const debounceRef = useRef()
  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)

  const fetchNews = async (q) => {
    setLoading(true)
    setArticles([])
    try {
      const res = await getNewsInspiration(q)
      setArticles(res.data.articles || [])
      setStatus(res.data.status || 'live')
    } catch {
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNews(query) }, [query])

  // Debounce inputVal changes to auto-search after user stops typing
  useEffect(() => {
    if (inputVal.trim() === query) return // Don't re-search if already current
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (inputVal.trim() && inputVal.trim() !== query) {
        setQuery(inputVal.trim())
      }
    }, 600) // 600ms debounce
    return () => clearTimeout(debounceRef.current)
  }, [inputVal])

  // Keep search button for accessibility, but not required
  const handleSearch = (e) => {
    e.preventDefault()
    if (inputVal.trim()) setQuery(inputVal.trim())
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="card bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-100">
        <div className="flex gap-4">
          <div className="text-4xl">📰</div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-1">Content Inspiration Engine</h2>
            <p className="text-gray-600 text-sm">
              Powered by <strong>NewsAPI</strong> — search trending news to spark campaign ideas.
              Click any headline to use it as inspiration for your next campaign.
            </p>
            {status === 'mock' && (
              <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-1.5 inline-block">
                ⚠️ Showing sample data — add <code>NEWS_API_KEY</code> to .env for live articles
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Search marketing news…"
          className="flex-1"
        />
        <button type="submit" className="btn-primary px-6">🔍 Search</button>
      </form>

      {/* Quick tags */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map(q => (
          <button
            key={q}
            onClick={() => { setInputVal(q); setQuery(q) }}
            className={`badge cursor-pointer transition-colors ${
              query === q ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3 animate-spin">⏳</div>
          Fetching latest news…
        </div>
      ) : articles.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500">No articles found for "{query}". Try a different search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="badge bg-sky-50 text-sky-700 text-xs shrink-0">{a.source || 'News'}</span>
                <span className="text-xs text-gray-400">{timeAgo(a.publishedAt)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 flex-1">
                {a.title || 'No title'}
              </h3>
              {a.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{a.description}</p>
              )}
              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                {a.url && a.url !== 'https://newsapi.org' && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:text-sky-800 text-xs font-medium"
                  >
                    Read article ↗
                  </a>
                )}
                <button
                  className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => handleCopy(a.title)}
                >
                  {copied === a.title ? '✅ Copied!' : '📋 Copy headline'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How to use */}
      <div className="card bg-gray-50">
        <h4 className="font-semibold text-gray-700 mb-3">💡 How to use this</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Search for a topic relevant to your next campaign</li>
          <li>Browse trending headlines for inspiration</li>
          <li>Copy a headline and use it as a starting point for your campaign content</li>
          <li>Head to <strong>Campaigns</strong> → New Campaign to create the campaign</li>
        </ol>
      </div>
    </div>
  )
}
