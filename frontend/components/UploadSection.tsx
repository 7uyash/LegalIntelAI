'use client'

import { useState, useRef } from 'react'
import { Upload, File, Loader } from 'lucide-react'
import axios from 'axios'

interface UploadSectionProps {
  onUploadSuccess: (data: any) => void
}

export default function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      onUploadSuccess(response.data)
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="gradient-text text-4xl md:text-5xl font-bold mb-4">
            Upload Legal Documents
          </h2>
          <p className="text-gray-400 text-lg">
            Upload PDF documents for AI-powered legal analysis and investigation
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`glass-effect rounded-2xl p-12 transition-all duration-300 ${
            isDragging ? 'border-blue-400 bg-glass-lighter' : 'border-glass-lighter'
          } border-2`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <Upload size={40} className="text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-0 blur-xl"></div>
            </div>

            {/* Text */}
            <div className="text-center">
              {selectedFile ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <File size={20} className="text-green-400" />
                    <p className="text-white font-semibold">{selectedFile.name}</p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-white text-xl font-semibold mb-1">
                    Drag and drop your PDF here
                  </p>
                  <p className="text-gray-400">or click to browse</p>
                </>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
              >
                Select File
              </button>
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload & Analyze'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📄', title: 'PDF Support', desc: 'Upload any PDF document up to 50MB' },
            { icon: '🤖', title: 'AI Analysis', desc: 'Powered by advanced AI algorithms' },
            { icon: '🔒', title: 'Secure', desc: 'Your documents are encrypted and protected' },
          ].map((item, idx) => (
            <div key={idx} className="glass-effect rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
