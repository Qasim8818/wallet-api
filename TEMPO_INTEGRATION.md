# Tempo Blockchain Integration

## Overview
Tempo is a Layer-1 blockchain purpose-built for payments with stablecoin gas fees and sub-second finality.

## Features Added
- **Stablecoin Gas Fees**: Pay transaction fees in USD stablecoins (USDC, pathUSD)
- **Sub-second Finality**: ~0.5 second transaction confirmation
- **TIP-20 Tokens**: Enhanced ERC-20 with 6-decimal precision for stablecoins
- **Payment Lanes**: Dedicated blockspace for payment transactions

## API Endpoints

### Fund Testnet Address
```bash
POST /api/v1/tempo/fund
{
  "address": "0x..."
}
```

### Get TIP-20 Token Balance
```bash
GET /api/v1/tempo/balance/{tokenAddress}/{userAddress}
```

### Transfer TIP-20 Tokens
```bash
POST /api/v1/tempo/transfer
{
  "tokenAddress": "0x...",
  "to": "0x...",
  "amount": "1000000",
  "privateKey": "0x..."
}
```

### Get Transaction Receipt
```bash
GET /api/v1/tempo/receipt/{txHash}
```

## Network Details
- **Chain ID**: 42429 (0xa5bd)
- **RPC URL**: https://rpc.testnet.tempo.xyz
- **Explorer**: https://explore.tempo.xyz
- **Block Time**: ~0.5 seconds

## Predeployed Contracts
- **pathUSD**: `0x20c0000000000000000000000000000000000000`
- **TIP-20 Factory**: `0x20fc000000000000000000000000000000000000`
- **Fee Manager**: `0xfeec000000000000000000000000000000000000`
- **Stablecoin DEX**: `0xdec0000000000000000000000000000000000000`

## Usage Example
```javascript
// Fund address with testnet tokens
const fundResult = await fetch('/api/v1/tempo/fund', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: '0x...' })
});

// Check pathUSD balance
const balance = await fetch('/api/v1/tempo/balance/0x20c0000000000000000000000000000000000000/0x...');

// Transfer pathUSD tokens
const transfer = await fetch('/api/v1/tempo/transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenAddress: '0x20c0000000000000000000000000000000000000',
    to: '0x...',
    amount: '1000000', // 1 pathUSD (6 decimals)
    privateKey: '0x...'
  })
});
```