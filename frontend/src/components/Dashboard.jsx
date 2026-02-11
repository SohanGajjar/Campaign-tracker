import { useState, useEffect } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts'
import { getDashboardStats } from '../api/campaigns'

const STATUS_COLORS = {
  draft: '#9ca3af', scheduled: '#3b82f6', active: '#22c55e',
  paused: '#f59e0b', completed: '#8b5cf6', cancelled: '#ef4444',
}

const PLATFORM_COLORS = [
  '#e1306c','#1877f2','#1da1f2','#0077b5','#ff0050','#ff0000','#6b7280'
]

const fmt = (v) => `$${Number(v).toLocaleString()}`

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading analytics…</div>
  if (!stats) return <div className="text-center py-20 text-red-400">Failed to load stats.</div>

  const hasData = stats.total_campaigns > 0

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon="📋" label="Total Campaigns" value={stats.total_campaigns} />
        <KPI icon="💰" label="Total Budget" value={fmt(stats.total_budget)} color="text-green-600" />
        <KPI icon="📈" label="Avg Budget" value={fmt(stats.avg_budget)} color="text-blue-600" />
        <KPI
          icon="✅"
          label="Active Campaigns"
          value={stats.status_breakdown.find(s => s.status === 'active')?.count || 0}
          color="text-purple-600"
        />
      </div>

      {!hasData && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-500">No campaign data yet. Create some campaigns to see analytics!</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Row 1: Status Pie + Platform Bar */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Campaign Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={stats.status_breakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ status, percent }) =>
                      `${status.charAt(0).toUpperCase() + status.slice(1)} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {stats.status_breakdown.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, 'Campaigns']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Campaigns by Platform</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.platform_breakdown} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Campaigns" radius={[4, 4, 0, 0]}>
                    {stats.platform_breakdown.map((entry, i) => (
                      <Cell key={entry.platform} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Budget by Platform + Monthly Trend */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Budget by Platform ($)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.budget_by_platform} barSize={32} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="platform" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Budget']} />
                  <Bar dataKey="total_budget" name="Budget" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Campaign Creation Trend</h3>
              {stats.monthly_trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={stats.monthly_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Campaigns"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ fill: '#0ea5e9', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[260px] text-gray-400">
                  Not enough data for trend
                </div>
              )}
            </div>
          </div>

          {/* Status summary table */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Status Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                    <th className="text-right py-2 text-gray-500 font-medium">Count</th>
                    <th className="text-right py-2 text-gray-500 font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.status_breakdown.map(s => (
                    <tr key={s.status} className="border-b border-gray-50">
                      <td className="py-2">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                          style={{ background: STATUS_COLORS[s.status] }}
                        />
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </td>
                      <td className="text-right font-medium">{s.count}</td>
                      <td className="text-right text-gray-400">
                        {((s.count / stats.total_campaigns) * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function KPI({ icon, label, value, color = 'text-gray-900' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}
