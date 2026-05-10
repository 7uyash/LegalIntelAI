'use client'

import { motion } from 'framer-motion'
import { Calendar, FileText, User } from 'lucide-react'

interface TimelineSectionProps {
  data: any
}

export default function TimelineSection({ data }: TimelineSectionProps) {
  const timelineEvents = [
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
    {
      date: '2024-08-10',
      title: 'Compliance Review',
      description: 'Legal compliance assessment completed',
      type: 'review',
    },
    {
      date: '2024-09-05',
      title: 'Liability Clause Update',
      description: 'Risk mitigation terms updated',
      type: 'update',
    },
    {
      date: '2024-10-01',
      title: 'Current Status',
      description: 'Agreement active with all terms in effect',
      type: 'current',
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
    <section className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="gradient-text text-4xl md:text-5xl font-bold mb-4">
            Document Timeline
          </h2>
          <p className="text-gray-400 text-lg">
            Track all key events and modifications across your legal documents
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>

          {/* Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-24"
              >
                {/* Event marker */}
                <motion.div
                  className={`absolute left-0 w-16 h-16 rounded-full ${getEventColor(
                    event.type
                  )} flex items-center justify-center -translate-x-6`}
                  whileHover={{ scale: 1.2 }}
                >
                  {event.type === 'milestone' && <Calendar size={28} className="text-white" />}
                  {event.type === 'event' && <FileText size={28} className="text-white" />}
                  {event.type === 'amendment' && <span className="text-2xl">📝</span>}
                  {event.type === 'review' && <span className="text-2xl">✓</span>}
                  {event.type === 'update' && <span className="text-2xl">⚡</span>}
                  {event.type === 'current' && <span className="text-2xl">🔴</span>}
                </motion.div>

                {/* Content */}
                <motion.div
                  className="glass-effect rounded-lg p-6"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white text-lg font-semibold">{event.title}</h3>
                    <span className="text-xs font-mono text-blue-400">{event.date}</span>
                  </div>
                  <p className="text-gray-400 mb-3">{event.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`inline-block w-2 h-2 rounded-full ${getEventColor(event.type)}`}></span>
                    <span className="uppercase tracking-wider">{event.type}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: '📅', label: 'Time Span', value: '5 months' },
            { icon: '📝', label: 'Total Events', value: '6 events' },
            { icon: '✏️', label: 'Amendments', value: '1 amendment' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-effect rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
