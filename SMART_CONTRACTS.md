# Smart Contract Deployment & Verification

## Overview
Complete smart contract deployment and verification system with OpenZeppelin Wizard integration and multi-platform verification support.

## Features
- **OpenZeppelin Contract Generation**: Auto-generate ERC20, ERC721, ERC1155 contracts
- **Multi-Network Deployment**: Deploy to Ethereum, Polygon, BSC, Tempo
- **Multi-Platform Verification**: OKLink, Etherscan, Polygonscan, BSCscan
- **CLI Command Generation**: Hardhat and Foundry verification commands
- **Source Code Flattening**: Prepare contracts for verification

## API Endpoints

### Generate OpenZeppelin Contract
```bash
POST /api/v1/contracts/generate
{
  "type": "ERC1155",
  "options": {
    "name": "GameAssets",
    "mintable": true,
    "burnable": true,
    "pausable": true,
    "supply": true
  }
}

# Governor DAO
{
  "type": "Governor",
  "options": {
    "name": "MyDAO",
    "votingDelay": "1",
    "votingPeriod": "45818",
    "quorumPercentage": "4",
    "timelock": true
  }
}

# Custom Contract
{
  "type": "Custom",
  "options": {
    "name": "DataStorage",
    "imports": ["@openzeppelin/contracts/access/Ownable.sol"],
    "inheritance": ["Ownable"],
    "functions": ["function store(string memory data) public onlyOwner {}"]
  }
}
```

### Deploy Contract
```bash
POST /api/v1/contracts/deploy
{
  "network": "ethereum",
  "contractData": {
    "abi": [...],
    "bytecode": "0x...",
    "constructorArgs": []
  },
  "privateKey": "0x..."
}
```

### Verify on OKLink
```bash
POST /api/v1/contracts/verify/oklink
{
  "chainShortName": "ETH",
  "contractData": {
    "address": "0x...",
    "name": "MyToken",
    "sourceCode": "pragma solidity...",
    "abi": [...],
    "compilerVersion": "v0.8.19+commit.7dd6d404"
  }
}
```

### Check Verification Status
```bash
GET /api/v1/contracts/verify/oklink/ETH/{guid}
```

### Generate Verification Commands
```bash
POST /api/v1/contracts/verify/commands
{
  "network": "ethereum",
  "contractAddress": "0x...",
  "contractPath": "contracts/MyToken.sol:MyToken",
  "constructorArgs": ["arg1", "arg2"]
}
```

### Flatten Source Code
```bash
POST /api/v1/contracts/flatten
{
  "mainContract": "pragma solidity ^0.8.19; contract MyToken {...}",
  "imports": {
    "@openzeppelin/contracts/token/ERC20/ERC20.sol": "pragma solidity ^0.8.19; contract ERC20 {...}"
  }
}
```

## Supported Networks

### Deployment Networks
- **Ethereum**: Mainnet, Sepolia, Goerli
- **Polygon**: Mainnet, Mumbai, Amoy
- **BSC**: Mainnet, Testnet
- **Tempo**: Testnet (stablecoin gas fees)

### Verification Platforms
- **OKLink**: ETH, POLYGON, BSC, ARBITRUM, OP, BASE, SCROLL
- **Etherscan**: Ethereum networks
- **Polygonscan**: Polygon networks
- **BSCscan**: BSC networks

## Contract Types

### ERC20 Token Options
- **Basic**: Standard ERC20 functionality
- **Mintable**: Owner can mint new tokens
- **Burnable**: Tokens can be burned
- **Pausable**: Contract can be paused
- **Permit**: EIP-2612 permit functionality

### ERC721 NFT Options
- **Basic**: Standard NFT functionality
- **Mintable**: Owner can mint NFTs
- **Burnable**: NFTs can be burned
- **Enumerable**: Token enumeration support
- **URI Storage**: Individual token URIs

### ERC1155 Multi-Token Options
- **Basic**: Standard multi-token functionality
- **Mintable**: Owner can mint tokens
- **Burnable**: Tokens can be burned
- **Pausable**: Contract can be paused
- **Supply**: Track token supply

### Governor DAO Options
- **Voting Delay**: Blocks before voting starts
- **Voting Period**: Blocks for voting duration
- **Proposal Threshold**: Tokens needed to propose
- **Quorum**: Percentage needed for quorum
- **Timelock**: Add timelock controller
- **Bravo**: Governor Bravo compatibility

### Custom Contract Options
- **License**: Contract license type
- **Solidity Version**: Compiler version
- **Imports**: OpenZeppelin imports
- **Inheritance**: Parent contracts
- **Events**: Custom events
- **State Variables**: Contract storage
- **Modifiers**: Access control
- **Functions**: Custom functionality

## Usage Examples

### 1. Generate and Deploy ERC20 Token
```javascript
// Generate contract
const generateResponse = await fetch('/api/v1/contracts/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'ERC20',
    options: {
      name: 'MyToken',
      symbol: 'MTK',
      mintable: true,
      burnable: true
    }
  })
});

// Deploy contract
const deployResponse = await fetch('/api/v1/contracts/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    network: 'ethereum',
    contractData: {
      abi: compiledContract.abi,
      bytecode: compiledContract.bytecode
    },
    privateKey: process.env.PRIVATE_KEY
  })
});
```

### 2. Verify Contract
```javascript
// Submit verification
const verifyResponse = await fetch('/api/v1/contracts/verify/oklink', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chainShortName: 'ETH',
    contractData: {
      address: '0x...',
      name: 'MyToken',
      sourceCode: contractCode,
      abi: contractAbi,
      compilerVersion: 'v0.8.19+commit.7dd6d404'
    }
  })
});

// Check status
const statusResponse = await fetch(`/api/v1/contracts/verify/oklink/ETH/${guid}`);
```

### 3. CLI Verification Commands
```bash
# Hardhat verification
npx hardhat verify --network ethereum 0x... "MyToken" "MTK"

# Foundry verification
forge verify-contract 0x... contracts/MyToken.sol:MyToken \
  --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/ETH \
  --watch
```

## Environment Variables
```env
# RPC URLs
ETH_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.alchemyapi.io/v2/YOUR_KEY
BSC_RPC_URL=https://bsc-dataseed.binance.org

# API Keys for verification
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
BSCSCAN_API_KEY=your_bscscan_key
```

## Security Notes
- Never commit private keys to version control
- Use environment variables for sensitive data
- Verify contracts on testnets before mainnet
- Always audit contracts before deployment
- Use multi-signature wallets for production deployments