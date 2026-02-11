import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getCampaigns, deleteCampaign } from '../api/campaigns'
import CampaignForm from './CampaignForm'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
}

const PLATFORM_ICONS = {
  instagram: '📸', facebook: '👥', twitter: '🐦', linkedin: '💼',
  tiktok: '🎵', youtube: '▶️', other: '🌐',
}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ platform: '', status: '' })
  const [showForm, setShowForm] = useState(false)
  const [editCampaign, setEditCampaign] = useState(null)
  const [viewCampaign, setViewCampaign] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.platform) params.platform = filters.platform
      if (filters.status) params.status = filters.status
      const res = await getCampaigns(params)
      // Defensive: always set to array
      setCampaigns(Array.isArray(res.data) ? res.data : [])
    } catch {
      toast.error('Failed to load campaigns')
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchCampaigns() }, [fetchCampaigns])

  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id)
      toast.success('Campaign deleted')
      setDeleteConfirm(null)
      fetchCampaigns()
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleFormClose = (saved) => {
    setShowForm(false)
    setEditCampaign(null)
    if (saved) fetchCampaigns()
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <select
            className="w-auto text-sm"
            value={filters.platform}
            onChange={e => setFilters(f => ({ ...f, platform: e.target.value }))}
          >
            <option value="">All Platforms</option>
            {['instagram','facebook','twitter','linkedin','tiktok','youtube','other'].map(p => (
              <option key={p} value={p}>{PLATFORM_ICONS[p]} {p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <select
            className="w-auto text-sm"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            {['draft','scheduled','active','paused','completed','cancelled'].map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(true)}>
          <span>+</span> New Campaign
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: campaigns.length, color: 'text-gray-900' },
          { label: 'Active', value: campaigns.filter(c => c.status === 'active').length, color: 'text-green-600' },
          { label: 'Scheduled', value: campaigns.filter(c => c.status === 'scheduled').length, color: 'text-blue-600' },
          { label: 'Total Budget', value: `$${campaigns.reduce((s,c) => s + parseFloat(c.budget), 0).toLocaleString()}`, color: 'text-indigo-600' },
        ].map(stat => (
          <div key={stat.label} className="card text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading campaigns…</div>
      ) : campaigns.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500">No campaigns found. Create your first one!</p>
          <button className="btn-primary mt-4" onClick={() => setShowForm(true)}>Create Campaign</button>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Campaign', 'Platform', 'Status', 'Budget', 'Scheduled', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{c.title}</div>
                      {c.target_audience && (
                        <div className="text-xs text-gray-400 mt-0.5">👤 {c.target_audience}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span>{PLATFORM_ICONS[c.platform]} {c.platform.charAt(0).toUpperCase() + c.platform.slice(1)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-700'}`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">${parseFloat(c.budget).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.scheduled_date || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-sky-600 hover:text-sky-800 font-medium text-xs"
                          onClick={() => setViewCampaign(c)}
                        >View</button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                          onClick={() => { setEditCampaign(c); setShowForm(true) }}
                        >Edit</button>
                        <button
                          className="text-red-500 hover:text-red-700 font-medium text-xs"
                          onClick={() => setDeleteConfirm(c)}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign Form Modal */}
      {showForm && (
        <CampaignForm
          campaign={editCampaign}
          onClose={handleFormClose}
        />
      )}

      {/* View Detail Modal */}
      {viewCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{viewCampaign.title}</h2>
              <button onClick={() => setViewCampaign(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <Row label="Platform" value={`${PLATFORM_ICONS[viewCampaign.platform]} ${viewCampaign.platform}`} />
              <Row label="Status">
                <span className={`badge ${STATUS_COLORS[viewCampaign.status]}`}>
                  {viewCampaign.status}
                </span>
              </Row>
              <Row label="Budget" value={`$${parseFloat(viewCampaign.budget).toLocaleString()}`} />
              {viewCampaign.scheduled_date && <Row label="Scheduled Date" value={viewCampaign.scheduled_date} />}
              {viewCampaign.target_audience && <Row label="Target Audience" value={viewCampaign.target_audience} />}
              {viewCampaign.description && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</div>
                  <p className="text-sm text-gray-700">{viewCampaign.description}</p>
                </div>
              )}
              {viewCampaign.content && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Content</div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{viewCampaign.content}</p>
                </div>
              )}
              {viewCampaign.tags && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {viewCampaign.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} className="badge bg-sky-50 text-sky-700">#{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <Row label="Created" value={new Date(viewCampaign.created_at).toLocaleString()} />
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button
                className="btn-primary flex-1"
                onClick={() => { setViewCampaign(null); setEditCampaign(viewCampaign); setShowForm(true) }}
              >Edit Campaign</button>
              <button className="btn-secondary" onClick={() => setViewCampaign(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-lg font-bold mb-2">Delete Campaign?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                onClick={() => handleDelete(deleteConfirm.id)}
              >Delete</button>
              <button className="btn-secondary flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, children }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900">{children || value}</span>
    </div>
  )
}
