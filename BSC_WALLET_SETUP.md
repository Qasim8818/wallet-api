# BSC Phantom Wallet - Complete Setup Guide

Your project has been transformed into a professional BSC Phantom-style wallet! This guide will help you get everything running.

## What's Been Created

### 1. Database (Supabase)
- **wallets table**: Stores encrypted wallet data
- **transactions table**: Transaction history
- **tokens table**: Token balances and metadata
- **Row Level Security**: All tables are secured

### 2. Frontend Application (React + Vite)
- Modern Phantom-style UI with dark theme
- Full wallet creation and import functionality
- Send/receive BNB transactions
- Token management
- Transaction history
- Multi-wallet support

### 3. Key Features
- **Secure**: Encrypted private keys with password protection
- **BSC Native**: Mainnet and testnet support
- **Beautiful UI**: Inspired by Phantom wallet design
- **Real-time**: Auto-updating balances and transactions
- **Multi-wallet**: Create and manage multiple wallets

## Quick Start

### Step 1: Set Up Supabase

1. The database schema is already created in your Supabase project
2. Note your Supabase credentials:
   - Project URL: From your Supabase dashboard
   - Anon Key: From Settings > API

### Step 2: Configure Frontend

1. Go to the client directory:
```bash
cd client
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3001` to see your wallet!

## Usage Guide

### First Time Setup

1. **Sign Up**: Create an account with email and password
2. **Create Wallet**: Click "Create New Wallet"
   - Enter a wallet name
   - Set a strong password (for encrypting private key)
   - **IMPORTANT**: Save your 12-word seed phrase safely!
3. **Start Using**: Your wallet is ready!

### Creating Additional Wallets

1. Click your current wallet name at the top
2. Click "Create New" or "Import"
3. Follow the same process

### Sending BNB

1. Click "Send" button on main screen
2. Enter recipient address (starts with 0x)
3. Enter amount
4. Confirm and enter your wallet password
5. Transaction sent!

### Receiving BNB

1. Click "Receive" button
2. Your address is copied to clipboard
3. Share this address to receive BNB

### Network Switching

- Click the network indicator in the header
- Switch between Mainnet and Testnet
- Testnet is recommended for testing

## Security Best Practices

### CRITICAL SECURITY NOTES

1. **Seed Phrase Protection**
   - Never share your 12-word seed phrase
   - Write it down on paper (not digital)
   - Store it in a safe place
   - Anyone with your seed phrase can access your funds

2. **Password Security**
   - Use a strong, unique password
   - Don't reuse passwords from other sites
   - Password encrypts your private key locally

3. **Testing First**
   - Always test on testnet before mainnet
   - Get free testnet BNB from: https://testnet.binance.org/faucet-smart
   - Verify everything works before using real funds

4. **Address Verification**
   - Always double-check recipient addresses
   - One wrong character = lost funds
   - Use address book for frequent recipients

## Architecture Overview

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Page screens
│   ├── store/          # State management (Zustand)
│   ├── config/         # Configuration
│   └── App.jsx         # Main app
```

### State Management
- **authStore**: User authentication
- **walletStore**: Wallet operations, balances, transactions

### Backend (Supabase)
- **Authentication**: Supabase Auth with email/password
- **Database**: PostgreSQL with RLS
- **Real-time**: Automatic updates

## Network Details

### BSC Mainnet
- Chain ID: 56
- Symbol: BNB
- RPC: https://bsc-dataseed1.binance.org
- Explorer: https://bscscan.com

### BSC Testnet
- Chain ID: 97
- Symbol: tBNB
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545
- Explorer: https://testnet.bscscan.com
- Faucet: https://testnet.binance.org/faucet-smart

## Popular Tokens (Pre-configured)

The wallet includes popular BSC tokens:
- USDT (Tether)
- USDC (USD Coin)
- BUSD (Binance USD)
- CAKE (PancakeSwap)

## Troubleshooting

### Problem: Cannot connect to wallet
**Solution**: Check your `.env` file has correct Supabase credentials

### Problem: Transactions failing
**Solution**:
- Ensure you have enough BNB for gas fees
- Verify you're on the correct network
- Check recipient address is valid

### Problem: Balance not showing
**Solution**:
- Click the refresh button
- Wait a few seconds for blockchain sync
- Check you're connected to the correct network

### Problem: White screen
**Solution**:
- Check browser console for errors
- Verify all dependencies installed: `npm install`
- Clear browser cache

## Advanced Configuration

### Adding Custom Tokens

Tokens can be added via the "Add Token" button:
1. Enter contract address
2. Symbol and decimals auto-populate
3. Token appears in your list

### Custom RPC Endpoints

Edit `client/src/config/bsc.js` to add custom RPC endpoints:
```javascript
rpcUrls: ['https://your-custom-rpc.com']
```

## Development

### Project Structure
- `client/`: React frontend application
- `server.js`: Backend API (existing)
- Database: Supabase (PostgreSQL)

### Building for Production

```bash
cd client
npm run build
```

Output will be in `client/dist/`

### Deploying

1. Build the frontend: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Set environment variables on hosting platform
4. Configure Supabase Auth redirect URLs

## Next Steps

### Recommended Enhancements

1. **Add More Tokens**: Integrate token price APIs
2. **Swap Feature**: Add DEX integration (PancakeSwap)
3. **NFT Support**: Display NFTs from wallet
4. **Address Book**: Save frequent contacts
5. **Transaction Notes**: Add custom notes to transactions
6. **Export Data**: CSV export of transactions
7. **Hardware Wallet**: Ledger/Trezor integration

### Production Checklist

- [ ] Test on testnet thoroughly
- [ ] Security audit of code
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup systems
- [ ] Set up customer support
- [ ] Add terms of service
- [ ] Implement analytics
- [ ] Set up staging environment

## Support & Resources

### BSC Resources
- Official Docs: https://docs.bnbchain.org
- BSCScan: https://bscscan.com
- Testnet Faucet: https://testnet.binance.org/faucet-smart

### Development Resources
- Ethers.js Docs: https://docs.ethers.org/v5
- React Docs: https://react.dev
- Supabase Docs: https://supabase.com/docs
- TailwindCSS: https://tailwindcss.com

## Important Notes

1. **Private Keys**: Never stored in plain text, always encrypted
2. **Password**: Required for all transactions
3. **Seed Phrase**: Only shown once during creation
4. **Testnet**: Use testnet for all testing
5. **Gas Fees**: Always keep BNB for transaction fees

## License

MIT License - Use freely for your projects!

---

**Your BSC Phantom Wallet is ready to use!**

Start by running `cd client && npm install && npm run dev`

For questions or issues, check the troubleshooting section or create a GitHub issue.
