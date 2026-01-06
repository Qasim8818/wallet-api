# ERC20 Token Bridge Setup

## Installation

### 1. Install Solidity Dependencies
```bash
cd solidity
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Copy the example files and fill in your values:
```bash
# For Hardhat deployment
cp solidity/.env.example solidity/.env

# For bridge backend
cp backend/.env.example backend/.env
```

## Deployment

### 1. Deploy Origin Token (Ethereum)
```bash
cd solidity
npm run deploy:origin
```

### 2. Deploy Destination Token (Harmony)
```bash
cd solidity
npm run deploy:destination
```

### 3. Update Backend Configuration
After deployment, update the contract addresses in `backend/.env`

### 4. Start Bridge Service
```bash
cd backend
npm start
```

## Usage

1. Users transfer CHSD tokens to the bridge wallet on Ethereum
2. Bridge service detects the transfer and mints D-CHSD on Harmony
3. Users can transfer D-CHSD back to bridge wallet on Harmony
4. Bridge service burns D-CHSD and transfers CHSD back on Ethereum

## Security Notes

- Never commit private keys to version control
- Use environment variables for sensitive data
- Test thoroughly on testnets before mainnet deployment
- Consider using multi-signature wallets for production