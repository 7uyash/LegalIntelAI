'use client'

import { Dispatch, SetStateAction } from 'react'
import { Menu } from 'lucide-react'

interface HeaderProps {
  activeSection: string
  setActiveSection: Dispatch<SetStateAction<string>>
}

export default function Header({ activeSection, setActiveSection }: HeaderProps) {
  const sections = [
    { id: 'upload', label: 'Upload' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'timeline', label: 'Timeline' },
  ]

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-glass-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚖️</span>
            </div>
            <h1 className="gradient-text text-2xl font-bold">LegalIntel AI</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`transition-all duration-300 pb-2 border-b-2 ${
                  activeSection === section.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-400 hover:text-gray-300">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}
