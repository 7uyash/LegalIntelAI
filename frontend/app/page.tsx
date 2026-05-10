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
  const [isLoading, setIsLoading] = useState(false)

  const handleUploadSuccess = (data: any) => {
    setAnalysisData(data)
    setActiveSection('workflow')
  }

  return (
    <main className="relative min-h-screen bg-dark-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blur-glow w-96 h-96 bg-purple-500 opacity-10 -top-32 -left-32"></div>
        <div className="blur-glow w-96 h-96 bg-blue-500 opacity-10 -bottom-32 -right-32"></div>
        <div className="blur-glow w-96 h-96 bg-pink-500 opacity-10 top-1/2 right-1/4"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
        
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
