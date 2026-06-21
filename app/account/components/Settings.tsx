'use client'

import { useEffect, useState } from 'react'
import { Bell, Coffee, Mail } from 'lucide-react'
import type {
  EmailPreferencesResponse,
  NotificationFrequency,
  NotificationType,
  ShopEmailPreference,
} from '@/types/email-preferences-types'

const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: 'news', label: 'News & announcements' },
  { value: 'new_locations', label: 'New locations' },
  { value: 'promotions', label: 'Promotions & deals' },
  { value: 'events', label: 'Events' },
]

const FREQUENCY_OPTIONS: { value: NotificationFrequency; label: string }[] = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly digest' },
]

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [frequency, setFrequency] = useState<NotificationFrequency>('daily')
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>(['news', 'new_locations'])
  const [shopPreferences, setShopPreferences] = useState<ShopEmailPreference[]>([])

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/account/email-preferences')
      if (!res.ok) {
        if (res.status === 401) {
          setError('Please sign in to manage your notification preferences')
          setLoading(false)
          return
        }
        throw new Error('Failed to fetch preferences')
      }
      const data: EmailPreferencesResponse = await res.json()

      if (data.global) {
        setNotificationsEnabled(data.global.notifications_enabled)
        setFrequency(data.global.notification_frequency)
        setNotificationTypes(data.global.notification_types)
      }
      setShopPreferences(data.shops)
    } catch (err) {
      console.error('Error fetching preferences:', err)
      setError('Failed to load preferences')
    } finally {
      setLoading(false)
    }
  }

  const saveGlobalPreferences = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/account/email-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notifications_enabled: notificationsEnabled,
          notification_frequency: frequency,
          notification_types: notificationTypes,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save preferences')
      }

      setSuccessMessage('Preferences saved successfully')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error saving preferences:', err)
      setError('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const toggleShopSubscription = async (shopId: string, currentSubscribed: boolean) => {
    const newSubscribed = !currentSubscribed

    // Optimistic update
    setShopPreferences((prev) =>
      prev.map((pref) =>
        pref.shop_id === shopId ? { ...pref, subscribed: newSubscribed } : pref
      )
    )

    try {
      const res = await fetch(`/api/account/email-preferences/${shopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscribed: newSubscribed }),
      })

      if (!res.ok) {
        // Revert on failure
        setShopPreferences((prev) =>
          prev.map((pref) =>
            pref.shop_id === shopId ? { ...pref, subscribed: currentSubscribed } : pref
          )
        )
        throw new Error('Failed to update shop preference')
      }
    } catch (err) {
      console.error('Error updating shop preference:', err)
      setError('Failed to update shop preference')
    }
  }

  const toggleNotificationType = (type: NotificationType) => {
    setNotificationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      </div>
    )
  }

  if (error && error.includes('sign in')) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
        </div>

        {error && !error.includes('sign in') && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Global toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="notifications-toggle" className="font-medium text-gray-900">
                Receive email updates
              </label>
              <p className="text-sm text-gray-500">Get notified about your favorite shops</p>
            </div>
            <button
              id="notifications-toggle"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                notificationsEnabled ? 'bg-yellow-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {notificationsEnabled && (
            <>
              {/* Frequency selector */}
              <div>
                <label htmlFor="frequency" className="block font-medium text-gray-900 mb-2">
                  Frequency
                </label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as NotificationFrequency)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  {FREQUENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notification types */}
              <div>
                <label className="block font-medium text-gray-900 mb-3">Notification types</label>
                <div className="space-y-3">
                  {NOTIFICATION_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationTypes.includes(type.value)}
                        onChange={() => toggleNotificationType(type.value)}
                        className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shop-specific notifications */}
              {shopPreferences.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Shop-specific notifications</h3>
                  <div className="space-y-3">
                    {shopPreferences.map((pref) => (
                      <div
                        key={pref.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Coffee className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {pref.shop?.name || 'Unknown Shop'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {pref.shop?.neighborhood || ''}
                            </p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pref.subscribed}
                            onChange={() => toggleShopSubscription(pref.shop_id, pref.subscribed)}
                            className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                          />
                          <span className="text-sm text-gray-600">Subscribed</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {shopPreferences.length === 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-500">
                    Favorite some shops to receive notifications about them.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Save button */}
          <div className="pt-4">
            <button
              onClick={saveGlobalPreferences}
              disabled={saving}
              className="w-full sm:w-auto rounded-lg bg-yellow-300 px-6 py-3 text-sm font-semibold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
