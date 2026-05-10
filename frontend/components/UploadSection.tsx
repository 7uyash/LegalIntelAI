'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Loader, ScanText, Search, ShieldCheck } from 'lucide-react'
import axios from 'axios'

interface UploadSectionProps {
  onUploadSuccess: (data: any) => void
}

export default function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusText, setStatusText] = useState('Ready')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      setStatusText('Uploading document')
      const uploadResponse = await axios.post(
        `${apiUrl}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      setStatusText(uploadResponse.data.ocr_used ? 'OCR complete' : 'Text extracted')
      const analysisResponse = await axios.post(
        `${apiUrl}/api/analyze/${uploadResponse.data.file_id}`,
        {
          file_id: uploadResponse.data.file_id,
          include_web_investigation: true,
          include_contradiction_detection: true,
          include_timeline: true,
          include_risk_assessment: true,
        }
      )
      setStatusText('Agent report ready')
      onUploadSuccess({
        ...uploadResponse.data,
        ...analysisResponse.data,
      })
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
      setStatusText('Failed')
      alert('Upload or analysis failed. Please check the backend and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="status-pill"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Gemini live</span>
              <span className="status-pill"><span className="h-2 w-2 rounded-full bg-sky-400"></span>Apify live</span>
              <span className="status-pill"><span className="h-2 w-2 rounded-full bg-indigo-400"></span>OCR enabled</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Legal Document Intake
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
              Upload a PDF and run the autonomous investigation pipeline with OCR, web evidence, risk scoring, and report generation.
            </p>
          </div>
          <div className="surface-muted px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Run status</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{statusText}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div
            className={`surface-panel border-2 p-6 transition-colors md:p-8 ${
              isDragging ? 'border-sky-400 bg-sky-950/30' : 'border-slate-700'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/30 p-8 text-center">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10">
                <Upload size={26} className="text-sky-300" />
              </div>

              {selectedFile ? (
                <div className="max-w-full">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <FileText size={20} className="shrink-0 text-emerald-300" />
                    <p className="truncate text-base font-semibold text-white">{selectedFile.name}</p>
                  </div>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB PDF selected
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xl font-semibold text-white">Drop a PDF legal file</p>
                  <p className="mt-2 text-sm text-slate-400">Contracts, notices, scanned pleadings, and agreements are supported.</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800"
                >
                  <FileText size={18} />
                  Select PDF
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isLoading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Running
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Run Agents
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            {[
              { icon: ScanText, title: 'OCR fallback', desc: 'Scanned PDFs are rendered and read with Gemini Vision.' },
              { icon: Search, title: 'Evidence search', desc: 'Apify collects public web context for extracted entities.' },
              { icon: ShieldCheck, title: 'Risk scoring', desc: 'Findings are scored and packaged into a review-ready report.' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="surface-panel p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-sky-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
                </div>
              )
            })}
          </aside>
        </div>
      </div>
    </section>
  )
}
