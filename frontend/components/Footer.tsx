'use client'

export default function Footer() {
  return (
    <footer className="glass-effect border-t border-glass-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <p className="text-gray-400 text-sm">
              Advanced AI-powered legal investigation platform
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-gray-300 cursor-pointer">Features</li>
              <li className="hover:text-gray-300 cursor-pointer">Pricing</li>
              <li className="hover:text-gray-300 cursor-pointer">Documentation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-gray-300 cursor-pointer">Privacy</li>
              <li className="hover:text-gray-300 cursor-pointer">Terms</li>
              <li className="hover:text-gray-300 cursor-pointer">Security</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-gray-300 cursor-pointer">Twitter</li>
              <li className="hover:text-gray-300 cursor-pointer">LinkedIn</li>
              <li className="hover:text-gray-300 cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-glass-lighter pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 LegalIntel AI. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Status
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Support
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                API Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
