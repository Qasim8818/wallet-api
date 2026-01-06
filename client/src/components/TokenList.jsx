import { useWalletStore } from '../store/walletStore'
import { POPULAR_TOKENS } from '../config/bsc'

export default function TokenList() {
  const { tokens } = useWalletStore()

  const displayTokens = tokens.length > 0 ? tokens : POPULAR_TOKENS.slice(0, 4)

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Tokens</h3>
        <button className="text-sm text-primary-500 hover:text-primary-400">
          Add Token
        </button>
      </div>

      {displayTokens.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No tokens found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayTokens.map((token, index) => (
            <div
              key={token.contract_address || token.address || index}
              className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center">
                  {token.logo ? (
                    <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
                  ) : (
                    <span className="text-xs font-bold">{token.symbol?.[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{token.symbol}</p>
                  <p className="text-xs text-gray-400">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {token.balance ? parseFloat(token.balance).toFixed(4) : '0.00'}
                </p>
                <p className="text-xs text-gray-400">
                  ${token.price_usd ? (token.balance * token.price_usd).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
