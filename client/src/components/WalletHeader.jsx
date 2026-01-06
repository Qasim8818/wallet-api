import { useState } from 'react'
import { useWalletStore } from '../store/walletStore'
import { BSC_CONFIG } from '../config/bsc'

export default function WalletHeader({ onSignOut }) {
  const { network, setNetwork } = useWalletStore()
  const [showMenu, setShowMenu] = useState(false)

  const toggleNetwork = () => {
    const newNetwork = network === 'mainnet' ? 'testnet' : 'mainnet'
    setNetwork(newNetwork)
    window.location.reload()
  }

  return (
    <div className="glass-effect border-b border-dark-600">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold">BSC Wallet</h1>
              <button
                onClick={toggleNetwork}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className={`w-2 h-2 rounded-full ${network === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                {BSC_CONFIG[network].chainName}
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-lg glass-effect hover:bg-dark-700 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg py-2 z-20 animate-fade-in">
                  <button
                    onClick={toggleNetwork}
                    className="w-full px-4 py-2 text-left hover:bg-dark-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Switch Network
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      onSignOut()
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-dark-700 transition-colors flex items-center gap-2 text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
