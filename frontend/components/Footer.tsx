'use client'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>LegalIntel AI · Bot-a-thon agent demo</p>
          <div className="flex flex-wrap gap-4">
            <span>Gemini</span>
            <span>Apify</span>
            <span>Zynd</span>
            <span>Superplane</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
