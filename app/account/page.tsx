'use client'

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Favorites from './components/Favorites'
import Settings from './components/Settings'

export default function Account() {
  const [currentSection, setCurrentSection] = useState('dashboard')

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <div className="flex-1 bg-gray-50">
        <div className="p-8">
          {currentSection === 'dashboard' && <Dashboard />}
          {currentSection === 'favorites' && <Favorites />}
          {currentSection === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  )
}
