import { useWalletStore } from '../store/walletStore'
import { BSC_CONFIG } from '../config/bsc'

export default function TransactionList() {
  const { transactions, currentWallet, network } = useWalletStore()

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const openTransaction = (txHash) => {
    const explorerUrl = BSC_CONFIG[network].blockExplorerUrls[0]
    window.open(`${explorerUrl}/tx/${txHash}`, '_blank')
  }

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Recent Transactions</h3>
        {transactions.length > 0 && (
          <button className="text-sm text-primary-500 hover:text-primary-400">
            View All
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {transactions.map((tx) => {
            const isSent = tx.from_address?.toLowerCase() === currentWallet?.address?.toLowerCase()
            const isConfirmed = tx.status === 'confirmed'

            return (
              <div
                key={tx.id}
                onClick={() => openTransaction(tx.tx_hash)}
                className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSent ? 'bg-red-500/20' : 'bg-green-500/20'
                  }`}>
                    <svg
                      className={`w-5 h-5 ${isSent ? 'text-red-500' : 'text-green-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isSent ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">
                      {isSent ? 'Sent' : 'Received'}
                      {tx.token_symbol && ` ${tx.token_symbol}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isSent ? `To ${formatAddress(tx.to_address)}` : `From ${formatAddress(tx.from_address)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                    {isSent ? '-' : '+'}{parseFloat(tx.amount).toFixed(6)} {tx.token_symbol || 'BNB'}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isConfirmed ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <p className="text-xs text-gray-400">
                      {formatTime(tx.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
