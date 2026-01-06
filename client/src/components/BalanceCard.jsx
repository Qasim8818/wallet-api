import { useEffect } from 'react'
import { useWalletStore } from '../store/walletStore'

export default function BalanceCard() {
  const { balance, loadBalance } = useWalletStore()

  useEffect(() => {
    loadBalance()
    const interval = setInterval(loadBalance, 30000)
    return () => clearInterval(interval)
  }, [loadBalance])

  return (
    <div className="gradient-bg rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/80">Total Balance</p>
        <button
          onClick={loadBalance}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-4xl font-bold text-white">
          {parseFloat(balance).toFixed(6)}
        </h2>
        <span className="text-xl text-white/80">BNB</span>
      </div>
      <p className="text-sm text-white/60 mt-2">
        ${(parseFloat(balance) * 600).toFixed(2)} USD
      </p>
    </div>
  )
}
