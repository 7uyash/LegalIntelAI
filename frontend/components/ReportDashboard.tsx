'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, AlertCircle, FileText } from 'lucide-react'

interface ReportDashboardProps {
  data: any
}

export default function ReportDashboard({ data }: ReportDashboardProps) {
  const metrics = [
    { icon: FileText, label: 'Total Documents', value: '1', color: 'blue' },
    { icon: Users, label: 'Entities Identified', value: '24', color: 'purple' },
    { icon: AlertCircle, label: 'Risk Flags', value: '7', color: 'red' },
    { icon: TrendingUp, label: 'Analysis Score', value: '92%', color: 'green' },
  ]

  const findings = [
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
    <section className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="gradient-text text-4xl md:text-5xl font-bold mb-4">
            Analysis Dashboard
          </h2>
          <p className="text-gray-400 text-lg">
            Comprehensive legal analysis and risk assessment
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-effect rounded-lg p-6 border-l-4 ${
                  metric.color === 'blue'
                    ? 'border-l-blue-400'
                    : metric.color === 'purple'
                    ? 'border-l-purple-400'
                    : metric.color === 'red'
                    ? 'border-l-red-400'
                    : 'border-l-green-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
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

        {/* Findings */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Key Findings & Risks</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {findings.map((finding, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-effect rounded-lg p-6 border-l-4 ${getSeverityColor(
                  finding.severity
                )}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-semibold">{finding.title}</h4>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${getSeverityLabel(finding.severity)}`}>
                    {finding.severity}
                  </span>
                </div>
                <p className="text-gray-400">{finding.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50">
            Export Full Report
          </button>
        </motion.div>
      </div>
    </section>
  )
}
