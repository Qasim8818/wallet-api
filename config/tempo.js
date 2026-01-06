// Tempo blockchain configuration
const TEMPO_CONFIG = {
  TESTNET: {
    chainId: 42429, // 0xa5bd
    name: 'Tempo Testnet',
    rpcUrl: 'https://rpc.testnet.tempo.xyz',
    explorer: 'https://explore.tempo.xyz',
    currency: 'USD stablecoins',
    blockTime: 0.5, // seconds
    contracts: {
      TIP20_FACTORY: '0x20fc000000000000000000000000000000000000',
      FEE_MANAGER: '0xfeec000000000000000000000000000000000000',
      STABLECOIN_DEX: '0xdec0000000000000000000000000000000000000',
      TIP403_REGISTRY: '0x403c000000000000000000000000000000000000',
      PATH_USD: '0x20c0000000000000000000000000000000000000',
      MULTICALL3: '0xcA11bde05977b3631167028862bE2a173976CA11'
    }
  }
};

module.exports = TEMPO_CONFIG;