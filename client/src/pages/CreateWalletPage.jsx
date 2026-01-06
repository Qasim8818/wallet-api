import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import toast from 'react-hot-toast'

export default function CreateWalletPage() {
  const navigate = useNavigate()
  const { createWallet } = useWalletStore()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('Wallet 1')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const { wallet, mnemonic: phrase, error } = await createWallet(name, password)
    setLoading(false)

    if (error) return

    setMnemonic(phrase)
    setStep(2)
  }

  const handleComplete = () => {
    if (!confirmed) {
      toast.error('Please confirm you have saved your seed phrase')
      return
    }
    navigate('/wallet')
  }

  const copyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic)
    toast.success('Seed phrase copied to clipboard')
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {step === 1 ? (
          <div className="glass-effect rounded-2xl p-8 animate-slide-up">
            <h1 className="text-2xl font-bold mb-6">Create New Wallet</h1>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors"
                  placeholder="My Wallet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors"
                  placeholder="Enter password"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors"
                  placeholder="Confirm password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors mt-6 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Wallet'}
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-effect rounded-2xl p-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Save Your Seed Phrase</h2>
                <p className="text-sm text-gray-400">Write this down and keep it safe</p>
              </div>
            </div>

            <div className="bg-dark-700 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {mnemonic.split(' ').map((word, i) => (
                  <div key={i} className="flex items-center gap-2 bg-dark-600 rounded px-3 py-2">
                    <span className="text-xs text-gray-500 w-6">{i + 1}.</span>
                    <span className="text-sm font-medium">{word}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={copyMnemonic}
                className="w-full py-2 glass-effect hover:bg-dark-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-200">
                Never share your seed phrase with anyone. Anyone with this phrase can access your funds.
              </p>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 accent-primary-500"
              />
              <span className="text-sm text-gray-300">
                I have written down my seed phrase and stored it in a safe place
              </span>
            </label>

            <button
              onClick={handleComplete}
              disabled={!confirmed}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
