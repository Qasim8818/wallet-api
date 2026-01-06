import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import toast from 'react-hot-toast'

export default function WalletSelector({ onClose }) {
  const navigate = useNavigate()
  const { wallets, currentWallet, switchWallet } = useWalletStore()

  const handleSelectWallet = (wallet) => {
    switchWallet(wallet)
    toast.success(`Switched to ${wallet.name}`)
    onClose()
  }

  const copyAddress = (address, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(address)
    toast.success('Address copied!')
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Wallets</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-dark-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto custom-scrollbar">
              {wallets.map((wallet) => {
                const isActive = currentWallet?.id === wallet.id

                return (
                  <button
                    key={wallet.id}
                    onClick={() => handleSelectWallet(wallet)}
                    className={`w-full p-4 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary-500/20 border-2 border-primary-500'
                        : 'bg-dark-700 hover:bg-dark-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-lg font-bold">
                          {wallet.name?.charAt(0) || 'W'}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{wallet.name}</p>
                            {isActive && (
                              <span className="px-2 py-0.5 bg-primary-500 text-xs rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 font-mono">
                            {wallet.address?.slice(0, 10)}...{wallet.address?.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => copyAddress(wallet.address, e)}
                        className="p-2 hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  onClose()
                  navigate('/create-wallet')
                }}
                className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/import-wallet')
                }}
                className="flex-1 py-3 glass-effect hover:bg-dark-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
