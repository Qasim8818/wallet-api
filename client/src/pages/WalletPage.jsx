import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import WalletHeader from '../components/WalletHeader'
import BalanceCard from '../components/BalanceCard'
import TokenList from '../components/TokenList'
import TransactionList from '../components/TransactionList'
import WalletSelector from '../components/WalletSelector'

export default function WalletPage() {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()
  const { wallets, currentWallet, loadWallets } = useWalletStore()
  const [showWalletSelector, setShowWalletSelector] = useState(false)

  useEffect(() => {
    loadWallets()
  }, [loadWallets])

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  if (wallets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">No Wallets Found</h2>
          <p className="text-gray-400 mb-6">Create or import a wallet to get started</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/create-wallet')}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors"
            >
              Create New Wallet
            </button>
            <button
              onClick={() => navigate('/import-wallet')}
              className="w-full py-3 glass-effect hover:bg-dark-700 rounded-lg font-medium transition-colors"
            >
              Import Existing Wallet
            </button>
            <button
              onClick={handleSignOut}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <WalletHeader onSignOut={handleSignOut} />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <button
          onClick={() => setShowWalletSelector(true)}
          className="w-full glass-effect rounded-xl p-4 hover:bg-dark-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-sm font-bold">
                {currentWallet?.name?.charAt(0) || 'W'}
              </div>
              <div className="text-left">
                <p className="font-medium">{currentWallet?.name}</p>
                <p className="text-sm text-gray-400">
                  {currentWallet?.address?.slice(0, 6)}...{currentWallet?.address?.slice(-4)}
                </p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <BalanceCard />

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/send')}
            className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentWallet?.address)
              toast.success('Address copied!')
            }}
            className="flex-1 py-3 glass-effect hover:bg-dark-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Receive
          </button>
        </div>

        <TokenList />
        <TransactionList />
      </div>

      {showWalletSelector && (
        <WalletSelector onClose={() => setShowWalletSelector(false)} />
      )}
    </div>
  )
}
