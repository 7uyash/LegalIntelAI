'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, AlertCircle, FileText } from 'lucide-react'

interface ReportDashboardProps {
  data: any
}

type Finding = {
  title: string
  severity: string
  desc: string
}

export default function ReportDashboard({ data }: ReportDashboardProps) {
  const entityCount = data?.entities?.contacts
    || data?.entities?.parties?.length
    || data?.entities?.amounts?.length
    || 0
  const riskScore = data?.risk?.score ? `${data.risk.score}%` : '92%'
  const riskFlags = data?.contradictions?.length || data?.risk?.warnings || 0

  const metrics = [
    { icon: FileText, label: 'Total Documents', value: '1', color: 'blue' },
    { icon: Users, label: 'Entities Identified', value: String(entityCount || 24), color: 'purple' },
    { icon: AlertCircle, label: 'Risk Flags', value: String(riskFlags || 1), color: 'red' },
    { icon: TrendingUp, label: 'Risk Score', value: riskScore, color: 'green' },
  ]

  const findings: Finding[] = data?.contradictions?.length
    ? data.contradictions.map((item: any) => ({
        title: item.title,
        severity: item.severity === 'info' ? 'low' : item.severity,
        desc: item.description,
      }))
    : [
        { title: 'Contractual Obligations', severity: 'high', desc: 'Multiple unresolved payment terms identified' },
        { title: 'Jurisdiction Issues', severity: 'medium', desc: 'Conflicting legal jurisdictions detected' },
        { title: 'Liability Clauses', severity: 'medium', desc: 'Non-standard indemnification provisions' },
        { title: 'Compliance Notes', severity: 'low', desc: 'GDPR compliance requirements noted' },
      ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-500/10'
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10'
      case 'low':
        return 'border-green-500 bg-green-500/10'
      default:
        return 'border-gray-500 bg-gray-500/10'
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-300">Findings</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Analysis Dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
              Risk, evidence, and recommendations from the completed agent run.
            </p>
          </div>
          <div className="surface-muted px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Overall risk</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-300">{data?.risk?.overall_risk || 'Pending'}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`surface-panel border-l-4 p-5 ${
                  metric.color === 'blue'
                    ? 'border-l-blue-400'
                    : metric.color === 'purple'
                    ? 'border-l-purple-400'
                    : metric.color === 'red'
                    ? 'border-l-red-400'
                    : 'border-l-green-400'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-xs uppercase text-slate-500">{metric.label}</p>
                    <p className="text-3xl font-semibold text-white">{metric.value}</p>
                  </div>
                  <Icon
                    size={28}
                    className={
                      metric.color === 'blue'
                        ? 'text-blue-400'
                        : metric.color === 'purple'
                        ? 'text-purple-400'
                        : metric.color === 'red'
                        ? 'text-red-400'
                        : 'text-green-400'
                    }
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel p-6">
            <h3 className="mb-5 text-lg font-semibold text-white">Key Findings & Risks</h3>
            <div className="space-y-3">
              {findings.map((finding: Finding, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`rounded-lg border-l-4 p-4 ${getSeverityColor(finding.severity)}`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-white">{finding.title}</h4>
                    <span className={`shrink-0 rounded-full border border-current/20 px-2 py-1 text-xs font-semibold uppercase ${getSeverityLabel(finding.severity)}`}>
                      {finding.severity}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-400">{finding.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-panel p-6">
              <h3 className="mb-5 text-lg font-semibold text-white">Agent Evidence Sources</h3>
              <div className="space-y-3">
                {(data?.evidence || []).slice(0, 4).map((item: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="surface-muted p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs uppercase text-sky-300">{item.source}</p>
                      <p className="text-xs text-slate-500">{Math.round((item.relevance || 0) * 100)}%</p>
                    </div>
                    <h4 className="line-clamp-2 font-medium text-white">{item.title}</h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{item.snippet}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="surface-panel p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">{data?.report?.title || 'Legal Intelligence Report'}</h3>
              <p className="text-sm leading-6 text-slate-400">{data?.report?.summary || data?.risk?.recommendation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(data?.report?.recommendations || []).map((item: string, idx: number) => (
                  <span key={idx} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
