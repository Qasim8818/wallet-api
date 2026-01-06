export const BSC_CONFIG = {
  mainnet: {
    chainId: '0x38',
    chainIdDecimal: 56,
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  testnet: {
    chainId: '0x61',
    chainIdDecimal: 97,
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  }
}

export const DEFAULT_NETWORK = 'mainnet'

export const POPULAR_TOKENS = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
  },
  {
    symbol: 'BUSD',
    name: 'Binance USD',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png'
  },
  {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png'
  }
]
