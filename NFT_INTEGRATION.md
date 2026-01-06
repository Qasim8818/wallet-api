# NFT API Integration

## Overview
Complete ERC1155 NFT management system with Venly API integration for creating contracts, token types, and minting NFTs.

## Features
- **ERC1155 Contract Creation**: Deploy NFT collections on multiple blockchains
- **Token Type Templates**: Create reusable NFT templates with metadata
- **Batch Minting**: Mint NFTs to multiple addresses simultaneously
- **Status Tracking**: Monitor deployment and minting progress
- **Multi-Chain Support**: Ethereum, Polygon, Avalanche, BSC, Arbitrum

## API Endpoints

### Authentication
```bash
POST /api/v1/nft/auth
{
  "apiKey": "your_venly_api_key"
}
```

### Create ERC1155 Contract
```bash
POST /api/v1/nft/contracts
{
  "chain": "MATIC",
  "name": "My NFT Collection",
  "symbol": "MNC",
  "description": "A collection of unique NFTs",
  "image": "https://example.com/collection-image.png",
  "externalUrl": "https://example.com"
}
```

### Create Token Type (NFT Template)
```bash
POST /api/v1/nft/token-types
{
  "chain": "MATIC",
  "contractAddress": "0xf0b30ec3720e9be1452b64d2ee476f57c2f535d3",
  "creations": [
    {
      "name": "Zap Village",
      "description": "Enter the Venly Zap Village!",
      "image": "https://storage.venly.io/village.jpeg"
    }
  ]
}
```

### Mint NFT
```bash
POST /api/v1/nft/mint
{
  "contractAddress": "0xf0b30ec3720e9be1452b64d2ee476f57c2f535d3",
  "chain": "MATIC",
  "tokenTypeId": "2",
  "destinations": [
    {
      "address": "0x9A9F6A560bBdCFbbb014303fc817D1e5EeaA3AE2",
      "amount": 1
    }
  ]
}
```

### Batch Mint
```bash
POST /api/v1/nft/batch-mint
{
  "contractAddress": "0xf0b30ec3720e9be1452b64d2ee476f57c2f535d3",
  "tokenTypeId": "2",
  "chain": "MATIC",
  "addresses": [
    "0x9A9F6A560bBdCFbbb014303fc817D1e5EeaA3AE2",
    "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    {
      "address": "0x123...",
      "amount": 5
    }
  ]
}
```

## Status Endpoints

### Check Contract Status
```bash
GET /api/v1/nft/contracts/{deploymentId}/status
```

### Check Token Type Status
```bash
GET /api/v1/nft/token-types/{creationId}/status
```

### Check Mint Status
```bash
GET /api/v1/nft/mint/{mintId}/status
```

## Supported Blockchains
- **MATIC** - Polygon
- **ETH** - Ethereum
- **AVAX** - Avalanche
- **BSC** - BNB Smart Chain
- **ARBITRUM** - Arbitrum

## Usage Examples

### 1. Complete NFT Collection Workflow
```javascript
// 1. Set API key
await fetch('/api/v1/nft/auth', {
  method: 'POST',
  body: JSON.stringify({ apiKey: 'your_venly_api_key' })
});

// 2. Create contract
const contractResponse = await fetch('/api/v1/nft/contracts', {
  method: 'POST',
  body: JSON.stringify({
    chain: 'MATIC',
    name: 'Gaming Assets',
    symbol: 'GA',
    description: 'Collectible gaming items'
  })
});

// 3. Wait for contract deployment
const deploymentId = contractResponse.result.id;
// Poll status until SUCCEEDED

// 4. Create token type
const tokenTypeResponse = await fetch('/api/v1/nft/token-types', {
  method: 'POST',
  body: JSON.stringify({
    chain: 'MATIC',
    contractAddress: 'deployed_contract_address',
    creations: [{
      name: 'Legendary Sword',
      description: 'A powerful weapon',
      image: 'https://example.com/sword.png'
    }]
  })
});

// 5. Mint NFTs
const mintResponse = await fetch('/api/v1/nft/mint', {
  method: 'POST',
  body: JSON.stringify({
    contractAddress: 'deployed_contract_address',
    chain: 'MATIC',
    tokenTypeId: '1',
    destinations: [
      { address: '0x...', amount: 1 }
    ]
  })
});
```

### 2. Batch Reward Distribution
```javascript
// Reward multiple users with NFTs
const addresses = [
  '0x9A9F6A560bBdCFbbb014303fc817D1e5EeaA3AE2',
  '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
  '0x123456789abcdef123456789abcdef1234567890'
];

const batchMintResponse = await fetch('/api/v1/nft/batch-mint', {
  method: 'POST',
  body: JSON.stringify({
    contractAddress: '0xf0b30ec3720e9be1452b64d2ee476f57c2f535d3',
    tokenTypeId: '2',
    chain: 'MATIC',
    addresses
  })
});
```

## Status Values
- **PENDING** - Operation in progress
- **SUCCEEDED** - Operation completed successfully
- **FAILED** - Operation failed

## Error Handling
All endpoints return standardized error responses:
```json
{
  "success": false,
  "error": "Error description",
  "code": 400
}
```

## Environment Variables
```env
VENLY_API_KEY=your_venly_api_key_here
VENLY_BASE_URL=https://api.venly.io/api/v3
```

## Use Cases
1. **Gaming**: In-game item distribution
2. **Events**: Attendance certificates and badges
3. **Loyalty Programs**: Reward tokens for customers
4. **Art Collections**: Digital art marketplace
5. **Certificates**: Educational or professional credentials