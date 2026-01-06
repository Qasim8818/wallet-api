# 🚀 BSC Phantom Wallet - Quick Start Guide

Welcome to your professional BSC Phantom Wallet! This guide will get you up and running in minutes.

## ✅ What You Have

A complete, production-ready BNB Smart Chain wallet featuring:

- **Beautiful UI**: Modern Phantom-style interface with smooth animations
- **Secure**: Encrypted private keys with password protection
- **Full-Featured**: Create wallets, import existing ones, send/receive BNB
- **Multi-Wallet**: Manage multiple wallets in one app
- **Real-time**: Auto-updating balances and transaction history
- **BSC Native**: Full support for BNB Smart Chain mainnet and testnet

## 🎯 Quick Setup (5 Minutes)

### Step 1: Set Up Supabase

1. Your database schema is **already created** in Supabase
2. Get your credentials from Supabase Dashboard:
   - Go to Settings > API
   - Copy `Project URL`
   - Copy `anon/public key`

### Step 2: Configure Environment

```bash
# In the client folder, create .env file
cd client
cp .env.example .env
```

Edit `client/.env` and add your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Install & Run

```bash
# Go back to root directory
cd ..

# Install all dependencies (backend + frontend)
npm run setup

# Start both backend and frontend
npm run dev:all
```

That's it! Open http://localhost:3001 to see your wallet.

## 🎨 Features Showcase

### Sign Up & Create Wallet
1. Visit http://localhost:3001
2. Click "Sign Up" and create an account
3. Click "Create New Wallet"
4. **SAVE YOUR SEED PHRASE** (12 words - keep it safe!)
5. Start using your wallet

### Send BNB
- Click "Send" button
- Enter recipient address (0x...)
- Enter amount
- Confirm with your password
- Done!

### Receive BNB
- Click "Receive" button
- Your address is copied
- Share it to receive BNB

### Import Existing Wallet
- Click wallet selector (top of page)
- Click "Import"
- Paste your seed phrase or private key
- Set a password
- Done!

## 🔐 Security Features

- **Encrypted Storage**: Private keys encrypted with your password
- **Seed Phrase Backup**: 12-word recovery phrase
- **Password Protected**: All transactions require password
- **Supabase RLS**: Row-level security on all data
- **No Plain Text**: Private keys never stored unencrypted

## 🌐 Network Support

### BSC Mainnet
- Real BNB
- Production network
- Use for actual transactions

### BSC Testnet
- Free test BNB
- Safe for testing
- Get tBNB from faucet: https://testnet.binance.org/faucet-smart

**Switch networks** by clicking the network indicator in the header.

## 📱 User Interface

### Dark Theme
- Modern, clean design inspired by Phantom wallet
- Smooth animations and transitions
- Responsive on all devices
- Easy on the eyes

### Color Scheme
- Primary: Teal/Turquoise (#00D4AA)
- Accent: Blue (#3B82F6)
- Background: Dark grays
- No purple (as requested!)

## 🛠️ Available Commands

```bash
# Backend only
npm start              # Production server
npm run dev            # Development with hot reload

# Frontend only
npm run client         # Start frontend dev server
npm run client:build   # Build for production

# Both together
npm run dev:all        # Run backend + frontend (recommended)

# Setup
npm run setup          # Install all dependencies
```

## 📂 Project Structure

```
project/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page screens
│   │   ├── store/         # State management
│   │   └── config/        # Configuration
│   └── package.json
├── server.js              # Express backend
├── package.json           # Root dependencies
└── BSC_WALLET_SETUP.md   # Detailed setup guide
```

## 🧪 Testing Flow

### Recommended Testing Steps

1. **Start on Testnet**
   - Switch to BSC Testnet
   - Get free tBNB from faucet
   - Test all features safely

2. **Create Multiple Wallets**
   - Test wallet creation
   - Test wallet import
   - Test wallet switching

3. **Test Transactions**
   - Send tBNB between your wallets
   - Verify transaction history
   - Check balance updates

4. **Try Features**
   - Copy address
   - View transaction on BSCScan
   - Refresh balance

5. **Move to Mainnet**
   - Only after testing everything
   - Start with small amounts
   - Always verify addresses

## ⚠️ Important Notes

### NEVER SHARE
- Seed phrase (12 words)
- Private key
- Wallet password

### ALWAYS BACKUP
- Write seed phrase on paper
- Store in safe place
- Never store digitally

### DOUBLE CHECK
- Recipient addresses before sending
- Transaction amounts
- Network selection (mainnet vs testnet)

## 🐛 Troubleshooting

### Issue: White screen
**Fix**: Check browser console, verify .env file has correct values

### Issue: Balance not showing
**Fix**: Click refresh button, wait a few seconds, check network connection

### Issue: Transaction failed
**Fix**: Ensure sufficient BNB for gas, verify address, check network

### Issue: Cannot create wallet
**Fix**: Check Supabase connection, verify credentials in .env

## 📚 Documentation

- **Full Setup Guide**: `BSC_WALLET_SETUP.md`
- **Frontend Details**: `client/README.md`
- **Database Schema**: Check Supabase dashboard

## 🎓 Next Steps

### Explore Features
1. Create multiple wallets
2. Send transactions on testnet
3. Import an existing wallet
4. View transaction history

### Customize
1. Add custom tokens
2. Change colors in `tailwind.config.js`
3. Add more networks in `config/bsc.js`
4. Integrate additional features

### Deploy
1. Build frontend: `npm run build`
2. Deploy to hosting (Vercel, Netlify, etc.)
3. Set environment variables
4. Configure Supabase Auth URLs

## 💡 Pro Tips

1. **Use Testnet First**: Always test new features on testnet
2. **Keep Small Amounts**: Don't store large amounts in hot wallets
3. **Backup Everything**: Multiple backups of seed phrases
4. **Stay Updated**: Keep dependencies updated
5. **Monitor Transactions**: Check BSCScan for transaction details

## 🤝 Support

Need help? Check these resources:

- **Setup Issues**: See `BSC_WALLET_SETUP.md`
- **Frontend Questions**: See `client/README.md`
- **BSC Docs**: https://docs.bnbchain.org
- **Supabase Docs**: https://supabase.com/docs

## 🎉 You're Ready!

Your BSC Phantom Wallet is fully configured and ready to use!

**Quick Start Command:**
```bash
npm run setup && npm run dev:all
```

Then visit: http://localhost:3001

---

**Built with**: React, Vite, TailwindCSS, Ethers.js, Supabase
**Network**: BNB Smart Chain (BSC)
**Type**: Non-custodial crypto wallet

Enjoy your new wallet! 🚀
