import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

export default function SendPage() {
  const navigate = useNavigate()
  const { currentWallet, balance, sendTransaction } = useWalletStore()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validateAddress = (address) => {
    try {
      ethers.utils.getAddress(address)
      return true
    } catch {
      return false
    }
  }

  const handleNext = (e) => {
    e.preventDefault()

    if (!validateAddress(recipient)) {
      toast.error('Invalid recipient address')
      return
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      toast.error('Insufficient balance')
      return
    }

    setShowConfirm(true)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await sendTransaction(recipient, amount, password)

    if (!error) {
      navigate('/wallet')
    } else {
      setLoading(false)
    }
  }

  const setMaxAmount = () => {
    const maxAmount = Math.max(0, parseFloat(balance) - 0.001)
    setAmount(maxAmount.toFixed(6))
  }

  if (showConfirm) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          <div className="glass-effect rounded-2xl p-8 animate-slide-up">
            <h1 className="text-2xl font-bold mb-6">Confirm Transaction</h1>

            <div className="space-y-4 mb-6">
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">From</p>
                <p className="text-sm font-mono">{currentWallet?.address}</p>
              </div>

              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">To</p>
                <p className="text-sm font-mono break-all">{recipient}</p>
              </div>

              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Amount</p>
                <p className="text-2xl font-bold">{amount} BNB</p>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Enter Password to Confirm
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors"
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Confirm & Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="glass-effect rounded-2xl p-8 animate-slide-up">
          <h1 className="text-2xl font-bold mb-6">Send BNB</h1>

          <div className="bg-dark-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1">Available Balance</p>
            <p className="text-2xl font-bold">{parseFloat(balance).toFixed(6)} BNB</p>
          </div>

          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors font-mono text-sm"
                placeholder="0x..."
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Amount (BNB)
                </label>
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="text-xs text-primary-500 hover:text-primary-400 font-medium"
                >
                  MAX
                </button>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors"
                placeholder="0.00"
                step="0.000001"
                min="0"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors mt-6"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
