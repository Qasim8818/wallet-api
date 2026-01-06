import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import toast from 'react-hot-toast'

export default function ImportWalletPage() {
  const navigate = useNavigate()
  const { importWallet } = useWalletStore()
  const [importMethod, setImportMethod] = useState('seed')
  const [seedPhrase, setSeedPhrase] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [name, setName] = useState('Imported Wallet')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImport = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    const importValue = importMethod === 'seed' ? seedPhrase.trim() : privateKey.trim()

    if (!importValue) {
      toast.error(`Please enter your ${importMethod === 'seed' ? 'seed phrase' : 'private key'}`)
      return
    }

    setLoading(true)
    const { error } = await importWallet(importValue, name, password)
    setLoading(false)

    if (!error) {
      navigate('/wallet')
    }
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

        <div className="glass-effect rounded-2xl p-8 animate-slide-up">
          <h1 className="text-2xl font-bold mb-6">Import Wallet</h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setImportMethod('seed')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                importMethod === 'seed'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Seed Phrase
            </button>
            <button
              onClick={() => setImportMethod('private')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                importMethod === 'private'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Private Key
            </button>
          </div>

          <form onSubmit={handleImport} className="space-y-4">
            {importMethod === 'seed' ? (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Seed Phrase (12 or 24 words)
                </label>
                <textarea
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors h-32 resize-none"
                  placeholder="Enter your seed phrase separated by spaces"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Private Key
                </label>
                <textarea
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors h-24 resize-none font-mono text-sm"
                  placeholder="0x..."
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Wallet Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-lg focus:border-primary-500 transition-colors"
                placeholder="My Imported Wallet"
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
              {loading ? 'Importing...' : 'Import Wallet'}
            </button>
          </form>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-yellow-200">
                Never share your seed phrase or private key with anyone. Make sure you are on the correct website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
