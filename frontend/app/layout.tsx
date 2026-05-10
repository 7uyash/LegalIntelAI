import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LegalIntel AI - Legal Investigation Platform',
  description: 'Advanced AI-powered legal investigation and document analysis platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-900 text-white">
        {children}
      </body>
    </html>
  )
}
