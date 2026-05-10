'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, FileInput, Loader, Network, Search, ShieldAlert, GitCommitVertical, FileCheck } from 'lucide-react'

interface WorkflowSectionProps {
  data: any
}

type WorkflowStep = {
  id: number
  name: string
  status: string
  summary: string
  provider: string
}

export default function WorkflowSection({ data }: WorkflowSectionProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const entityCount = data?.entities?.contacts
    || data?.entities?.parties?.length
    || data?.entities?.amounts?.length
    || 0

  const steps: WorkflowStep[] = data?.workflow?.length
    ? data.workflow.map((step: any, index: number) => ({
        id: index + 1,
        name: step.name,
        status: step.status,
        summary: step.summary,
        provider: step.provider,
      }))
    : [
        { id: 1, name: 'Document Ingestion', status: 'completed', summary: 'Document uploaded and parsed.', provider: 'LegalIntel' },
        { id: 2, name: 'Text Extraction', status: 'completed', summary: 'PDF text extracted for analysis.', provider: 'PyPDF2' },
        { id: 3, name: 'Agent Analysis', status: 'completed', summary: 'Autonomous workflow ready.', provider: 'LegalIntel' },
      ]

  useEffect(() => {
    // Simulate workflow progression
    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setCompletedSteps((prev) => [...prev, currentStep])
        currentStep++
      } else {
        clearInterval(interval)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-300">Agent Run</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Investigation Workflow
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
              Each agent produces an auditable artifact for the legal intelligence report.
            </p>
          </div>
          <div className="surface-muted px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Completion</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-300">
              {Math.round((completedSteps.length / steps.length) * 100)}%
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {steps.map((step: WorkflowStep, index: number) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="surface-panel p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${
                    completedSteps.includes(index)
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : step.status === 'in-progress'
                      ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle size={20} />
                  ) : step.status === 'in-progress' ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    <StepIcon index={index} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-white">{step.name}</h3>
                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
                      {step.provider}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{step.summary}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="surface-panel mt-6 p-6"
        >
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Processing Summary</h3>
              <p className="text-sm text-slate-500">{data?.filename || 'legal_document.pdf'}</p>
            </div>
            <span className="status-pill">
              Extraction: {data?.ocr_used ? 'Gemini OCR' : data?.extraction_method || 'Embedded PDF text'}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface-muted p-4">
              <p className="text-xs uppercase text-slate-500">Pages Analyzed</p>
              <p className="mt-2 text-2xl font-semibold text-sky-300">
                {data?.pages || '--'}
              </p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-xs uppercase text-slate-500">Entities Found</p>
              <p className="mt-2 text-2xl font-semibold text-indigo-300">
                {entityCount || (typeof data?.entities === 'string' ? data.entities : '--')}
              </p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-xs uppercase text-slate-500">Risk Score</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">
                {data?.risk?.score ?? '--'}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {['zynd', 'apify', 'superplane'].map((name) => (
              <div key={name} className="surface-muted p-4">
                <p className="mb-1 text-xs uppercase text-slate-500">{name}</p>
                <p className="font-semibold text-white">
                  {data?.integrations?.[name]?.enabled ? 'Enabled' : 'Ready'}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {data?.integrations?.[name]?.mode || data?.integrations?.[name]?.purpose || data?.integrations?.[name]?.registry_url || 'Configured surface'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StepIcon({ index }: { index: number }) {
  const icons = [FileInput, Search, Network, Search, ShieldAlert, GitCommitVertical, ShieldAlert, FileCheck]
  const Icon = icons[index] || CheckCircle
  return <Icon size={20} />
}
