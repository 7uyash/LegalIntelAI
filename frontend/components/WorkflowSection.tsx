'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader } from 'lucide-react'

interface WorkflowSectionProps {
  data: any
}

export default function WorkflowSection({ data }: WorkflowSectionProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    { id: 1, name: 'Document Ingestion', status: 'completed' },
    { id: 2, name: 'Text Extraction', status: 'completed' },
    { id: 3, name: 'Entity Recognition', status: 'in-progress' },
    { id: 4, name: 'Relationship Mapping', status: 'pending' },
    { id: 5, name: 'Legal Analysis', status: 'pending' },
    { id: 6, name: 'Report Generation', status: 'pending' },
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
    <section className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="gradient-text text-4xl md:text-5xl font-bold mb-4">
            AI Agent Workflow
          </h2>
          <p className="text-gray-400 text-lg">
            Watch as our AI agents analyze and process your legal documents
          </p>
        </div>

        {/* Workflow Timeline */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-start gap-6"
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    completedSteps.includes(index)
                      ? 'bg-green-500 text-white'
                      : step.status === 'in-progress'
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                  animate={
                    step.status === 'in-progress'
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {completedSteps.includes(index) ? (
                    <CheckCircle size={24} />
                  ) : step.status === 'in-progress' ? (
                    <Loader size={24} className="animate-spin" />
                  ) : (
                    step.id
                  )}
                </motion.div>
                {index !== steps.length - 1 && (
                  <motion.div
                    className={`w-1 h-12 mt-2 transition-colors duration-300 ${
                      completedSteps.includes(index + 1)
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                    }`}
                    animate={
                      completedSteps.includes(index)
                        ? { background: 'rgb(34, 197, 94)' }
                        : {}
                    }
                  ></motion.div>
                )}
              </div>

              {/* Step content */}
              <motion.div
                className="glass-effect rounded-lg p-6 flex-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {step.name}
                    </h3>
                    <p className="text-gray-400">
                      {step.status === 'completed' && 'Processing completed'}
                      {step.status === 'in-progress' && 'Currently processing...'}
                      {step.status === 'pending' && 'Waiting to start'}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {index === 0 && '📥'}
                    {index === 1 && '📖'}
                    {index === 2 && '🔍'}
                    {index === 3 && '🔗'}
                    {index === 4 && '⚖️'}
                    {index === 5 && '📋'}
                  </div>
                </div>

                {step.status === 'in-progress' && (
                  <motion.div
                    className="mt-4 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                    animate={{ scaleX: [0, 1] }}
                    transition={{ duration: 2 }}
                  ></motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 glass-effect rounded-lg p-8 text-center"
        >
          <h3 className="text-white text-2xl font-bold mb-4">Processing Summary</h3>
          <p className="text-gray-400 mb-4">
            Document: {data?.filename || 'legal_document.pdf'}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-dark-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Pages Analyzed</p>
              <p className="text-blue-400 text-2xl font-bold">
                {data?.pages || '--'}
              </p>
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Entities Found</p>
              <p className="text-purple-400 text-2xl font-bold">
                {data?.entities || '--'}
              </p>
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Progress</p>
              <p className="text-green-400 text-2xl font-bold">
                {Math.round((completedSteps.length / steps.length) * 100)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
