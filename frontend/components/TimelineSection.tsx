'use client'

import { motion } from 'framer-motion'
import { Calendar, FileText, GitCommitVertical, Pencil, ShieldAlert } from 'lucide-react'

interface TimelineSectionProps {
  data: any
}

export default function TimelineSection({ data }: TimelineSectionProps) {
  const timelineEvents = data?.timeline?.length
    ? data.timeline
    : [
        {
          date: '2024-05-01',
          title: 'Contract Initiation',
          description: 'Agreement between parties established',
          type: 'milestone',
        },
        {
          date: '2024-06-15',
          title: 'Payment Terms Agreed',
          description: 'Financial obligations documented',
          type: 'event',
        },
        {
          date: '2024-07-22',
          title: 'Amendment #1',
          description: 'Schedule modification and timeline adjustment',
          type: 'amendment',
        },
      ]

  const getEventColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-blue-500'
      case 'amendment':
        return 'bg-purple-500'
      case 'review':
        return 'bg-green-500'
      case 'update':
        return 'bg-yellow-500'
      case 'current':
        return 'bg-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-300">Timeline</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Document Events
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
              Dates and events extracted from the legal document and OCR output.
            </p>
          </div>
          <span className="status-pill">
            {timelineEvents.length} event{timelineEvents.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="surface-panel p-5 md:p-6">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-700"></div>

            <div className="space-y-5">
              {timelineEvents.map((event: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative pl-14"
                >
                  <div className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-lg ${getEventColor(event.type)} text-white`}>
                    <EventIcon type={event.type} />
                  </div>
                  <div className="surface-muted p-4">
                    <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="font-semibold text-white">{event.title}</h3>
                      <span className="font-mono text-xs text-sky-300">{event.date}</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-400">{event.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{event.type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          {[
            { icon: Calendar, label: 'Timeline Mode', value: data?.timeline?.length ? 'Extracted' : 'Demo' },
            { icon: GitCommitVertical, label: 'Total Events', value: `${timelineEvents.length} events` },
            { icon: ShieldAlert, label: 'Risk Level', value: data?.risk?.overall_risk || 'Pending' },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="surface-panel p-5">
                <Icon size={20} className="mb-3 text-sky-300" />
                <p className="mb-1 text-xs uppercase text-slate-500">{stat.label}</p>
                <p className="text-xl font-semibold text-white">{stat.value}</p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function EventIcon({ type }: { type: string }) {
  if (type === 'milestone') return <Calendar size={18} />
  if (type === 'amendment') return <Pencil size={18} />
  return <FileText size={18} />
}
