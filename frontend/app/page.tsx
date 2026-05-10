'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import UploadSection from '@/components/UploadSection'
import WorkflowSection from '@/components/WorkflowSection'
import ReportDashboard from '@/components/ReportDashboard'
import TimelineSection from '@/components/TimelineSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeSection, setActiveSection] = useState('upload')
  const [analysisData, setAnalysisData] = useState<any>(null)

  const handleUploadSuccess = (data: any) => {
    setAnalysisData(data)
    setActiveSection('workflow')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.10),transparent_36rem)]"></div>

      <div className="relative z-10">
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          hasAnalysis={Boolean(analysisData)}
        />
        
        <div className="min-h-screen">
          {activeSection === 'upload' && (
            <UploadSection onUploadSuccess={handleUploadSuccess} />
          )}
          {activeSection === 'workflow' && analysisData && (
            <WorkflowSection data={analysisData} />
          )}
          {activeSection === 'dashboard' && analysisData && (
            <ReportDashboard data={analysisData} />
          )}
          {activeSection === 'timeline' && analysisData && (
            <TimelineSection data={analysisData} />
          )}
        </div>

        <Footer />
      </div>
    </main>
  )
}
