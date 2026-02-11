import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// Campaigns CRUD
export const getCampaigns = (params) => api.get('/campaigns/', { params })
export const getCampaign = (id) => api.get(`/campaigns/${id}/`)
export const createCampaign = (data) => api.post('/campaigns/', data)
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}/`, data)
export const patchCampaign = (id, data) => api.patch(`/campaigns/${id}/`, data)
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}/`)

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/')

// News API
export const getNewsInspiration = (q) => api.get('/news/', { params: { q } })
