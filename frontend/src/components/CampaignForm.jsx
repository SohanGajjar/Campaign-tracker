import { useState } from 'react'
import toast from 'react-hot-toast'
import { createCampaign, updateCampaign } from '../api/campaigns'

const PLATFORMS = ['instagram','facebook','twitter','linkedin','tiktok','youtube','other']
const STATUSES = ['draft','scheduled','active','paused','completed','cancelled']

const EMPTY = {
  title: '', description: '', platform: 'instagram', status: 'draft',
  budget: '', target_audience: '', content: '', scheduled_date: '', tags: '',
}

export default function CampaignForm({ campaign, onClose }) {
  const isEdit = Boolean(campaign)
  const [form, setForm] = useState(isEdit ? {
    title: campaign.title || '',
    description: campaign.description || '',
    platform: campaign.platform || 'instagram',
    status: campaign.status || 'draft',
    budget: campaign.budget || '',
    target_audience: campaign.target_audience || '',
    content: campaign.content || '',
    scheduled_date: campaign.scheduled_date || '',
    tags: campaign.tags || '',
  } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.budget !== '' && isNaN(parseFloat(form.budget))) errs.budget = 'Must be a number'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = { ...form, budget: form.budget || '0' }
      if (!payload.scheduled_date) delete payload.scheduled_date
      if (isEdit) {
        await updateCampaign(campaign.id, payload)
        toast.success('Campaign updated!')
      } else {
        await createCampaign(payload)
        toast.success('Campaign created!')
      }
      onClose(true)
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        setErrors(Object.fromEntries(Object.entries(data).map(([k,v]) => [k, Array.isArray(v) ? v[0] : v])))
      } else {
        toast.error('Something went wrong')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold">{isEdit ? '✏️ Edit Campaign' : '✨ New Campaign'}</h2>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <Field label="Campaign Title *" error={errors.title}>
            <input value={form.title} onChange={set('title')} placeholder="e.g. Summer Sale Launch" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {/* Platform */}
            <Field label="Platform">
              <select value={form.platform} onChange={set('platform')}>
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </Field>

            {/* Status */}
            <Field label="Status">
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Budget */}
            <Field label="Budget ($)" error={errors.budget}>
              <input
                type="number" min="0" step="0.01"
                value={form.budget} onChange={set('budget')}
                placeholder="0.00"
              />
            </Field>

            {/* Scheduled Date */}
            <Field label="Scheduled Date">
              <input type="date" value={form.scheduled_date} onChange={set('scheduled_date')} />
            </Field>
          </div>

          {/* Target Audience */}
          <Field label="Target Audience">
            <input value={form.target_audience} onChange={set('target_audience')} placeholder="e.g. 18–34 year olds interested in fashion" />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Campaign objectives and overview…" />
          </Field>

          {/* Content */}
          <Field label="Content / Copy">
            <textarea value={form.content} onChange={set('content')} rows={3} placeholder="Draft post content, captions, scripts…" />
          </Field>

          {/* Tags */}
          <Field label="Tags (comma separated)">
            <input value={form.tags} onChange={set('tags')} placeholder="summer, sale, fashion" />
          </Field>
        </div>

        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? '⏳ Saving…' : (isEdit ? '✅ Save Changes' : '🚀 Create Campaign')}
          </button>
          <button className="btn-secondary" onClick={() => onClose(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label>{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
