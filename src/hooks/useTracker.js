import { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

export function useTracker() {
  const [goals, setGoals] = useState({ cal: 2000, pro: 160, carb: 180, fat: 71, weight: null, goal_weight: null })
  const [todayLog, setTodayLog] = useState([])
  const [library, setLibrary] = useState([])
  const [history, setHistory] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async (withLoading = true) => {
    if (withLoading) setLoading(true)
    try {
      const [goalsRes, logRes, libRes] = await Promise.all([
        api.get('/goals/'),
        api.get('/log/'),
        api.get('/library/'),
      ])
      setGoals(goalsRes.data)
      setTodayLog(logRes.data)
      setLibrary(libRes.data)
    } catch (e) {
      console.error('Failed to load data', e)
    } finally {
      if (withLoading) setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const fetchHistory = useCallback(async () => {
    const res = await api.get('/log/history')
    setHistory(res.data)
  }, [])

  const addLogEntry = useCallback(async (entry, alreadySaved = false) => {
    if (alreadySaved) {
      setTodayLog(prev => [...prev, entry])
      return entry
    }
    const res = await api.post('/log/', entry)
    setTodayLog(prev => [...prev, res.data])
    return res.data
  }, [])

  const removeLogEntry = useCallback(async (id) => {
    await api.delete(`/log/${id}`)
    setTodayLog(prev => prev.filter(e => e.id !== id))
  }, [])

  const addFood = useCallback(async (food) => {
    const res = await api.post('/library/', food)
    setLibrary(prev => [...prev, res.data])
    return res.data
  }, [])

  const updateFood = useCallback(async (id, food) => {
    const res = await api.put(`/library/${id}`, food)
    setLibrary(prev => prev.map(f => f.id === id ? res.data : f))
    return res.data
  }, [])

  const removeFood = useCallback(async (id) => {
    await api.delete(`/library/${id}`)
    setLibrary(prev => prev.filter(f => f.id !== id))
  }, [])

  const saveGoals = useCallback(async (data) => {
    const res = await api.put('/goals/', data)
    setGoals(res.data)
    return res.data
  }, [])

  return {
    goals, todayLog, library, history,
    loading, fetchAll, fetchHistory,
    addLogEntry, removeLogEntry,
    addFood, updateFood, removeFood,
    saveGoals,
  }
}
