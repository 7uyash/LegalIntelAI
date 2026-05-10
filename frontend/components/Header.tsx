'use client'

import { Dispatch, SetStateAction } from 'react'
import { FileSearch, Menu } from 'lucide-react'

interface HeaderProps {
  activeSection: string
  setActiveSection: Dispatch<SetStateAction<string>>
  hasAnalysis?: boolean
}

export default function Header({ activeSection, setActiveSection, hasAnalysis = false }: HeaderProps) {
  const sections = [
    { id: 'upload', label: 'Upload' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'timeline', label: 'Timeline' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/88 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10">
              <FileSearch size={19} className="text-sky-300" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-wide text-white">LegalIntel AI</h1>
              <p className="hidden text-xs text-slate-500 sm:block">Autonomous legal investigation</p>
            </div>
          </div>

          <nav className="hidden items-center rounded-lg border border-slate-800 bg-slate-900/70 p-1 md:flex">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                disabled={!hasAnalysis && section.id !== 'upload'}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-slate-800 text-white'
                    : !hasAnalysis && section.id !== 'upload'
                    ? 'cursor-not-allowed text-slate-600'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <button className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-slate-200 md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}
