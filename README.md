# 🚀 BSC Phantom Wallet

A professional, production-ready cryptocurrency wallet for BNB Smart Chain with a beautiful Phantom-inspired UI.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node](https://img.shields.io/badge/Node-20+-339933)

## ✨ What Is This?

A complete, secure, non-custodial crypto wallet for BNB Smart Chain featuring:

- **Modern UI**: Beautiful Phantom-style interface with smooth animations
- **Secure**: Encrypted private keys with password protection
- **Full-Featured**: Create/import wallets, send/receive BNB, manage tokens
- **Multi-Wallet**: Manage multiple accounts in one app
- **Real-time**: Auto-updating balances and transaction history
- **Production-Ready**: Built with best practices and security in mind

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works!)
- Modern web browser

### 1. Clone & Install

```bash
# Install all dependencies (backend + frontend)
npm run setup
```

### 2. Configure Supabase

1. Database is already set up (migration was applied)
2. Get your credentials from Supabase Dashboard → Settings → API
3. Create `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run

```bash
# Start both backend and frontend
npm run dev:all
```

Open http://localhost:3001 - Your wallet is ready!

## 📱 Features

### Wallet Management
- ✅ Create new wallets with 12-word seed phrase
- ✅ Import existing wallets (seed phrase or private key)
- ✅ Manage multiple wallets
- ✅ Switch between wallets instantly
- ✅ Password-protected operations

### Transactions
- ✅ Send BNB to any address
- ✅ Receive BNB (one-click address copy)
- ✅ Real-time transaction tracking
- ✅ Complete transaction history
- ✅ Click to view on BSCScan

### Network Support
- ✅ BSC Mainnet (production)
- ✅ BSC Testnet (testing with free tBNB)
- ✅ Easy network switching
- ✅ Automatic gas estimation

### Security
- ✅ Private keys encrypted with your password
- ✅ Never stored in plain text
- ✅ 12-word seed phrase backup
- ✅ Supabase RLS (Row Level Security)
- ✅ Password required for all transactions

### User Experience
- ✅ Beautiful dark theme UI
- ✅ Smooth animations
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time balance updates
- ✅ Token support (BEP-20)
- ✅ Clean, intuitive interface

## 🏗️ Architecture

```
BSC Phantom Wallet
├── Frontend (React + Vite)
│   ├── Modern UI with TailwindCSS
│   ├── Zustand for state management
│   ├── Ethers.js for blockchain interaction
│   └── React Router for navigation
│
├── Backend (Express + Node.js)
│   ├── API endpoints (optional)
│   └── Support for existing features
│
└── Database (Supabase)
    ├── PostgreSQL with RLS
    ├── User authentication
    ├── Wallet data storage
    └── Transaction history
```

## 📖 Documentation

- **Quick Start**: `START_HERE.md` - Get running in 5 minutes
- **Detailed Setup**: `BSC_WALLET_SETUP.md` - Complete configuration guide
- **Frontend Details**: `client/README.md` - React app documentation

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **TailwindCSS**: Utility-first styling
- **Ethers.js**: Blockchain interactions
- **Zustand**: State management
- **React Router**: Navigation
- **React Hot Toast**: Notifications

### Backend & Database
- **Supabase**: PostgreSQL database with auth
- **Express**: REST API server
- **Node.js**: Runtime environment

### Blockchain
- **BNB Smart Chain**: Layer 1 blockchain
- **BSC Mainnet**: Production network
- **BSC Testnet**: Testing network

## 🎨 Design

The wallet features a modern, clean design inspired by Phantom wallet:

- **Color Scheme**: Teal/turquoise primary (#00D4AA), blue accent (#3B82F6)
- **Theme**: Dark mode with smooth gradients
- **Typography**: Clean, readable fonts
- **Animations**: Smooth transitions and micro-interactions
- **Layout**: Spacious, intuitive interface

## 🔐 Security Best Practices

### What We Protect
- ✅ Private keys encrypted with AES-256
- ✅ Password-protected wallet operations
- ✅ Secure seed phrase generation
- ✅ Row-level security on all data
- ✅ No plain text storage

### What You Must Do
- ⚠️ **Save your seed phrase** - Write it down on paper
- ⚠️ **Never share** your seed phrase or private key
- ⚠️ **Use strong passwords** - Minimum 8 characters
- ⚠️ **Test on testnet first** - Before using mainnet
- ⚠️ **Verify addresses** - Always double-check before sending

## 📊 Available Commands

```bash
# Setup
npm run setup              # Install all dependencies

# Development
npm run dev:all            # Run backend + frontend together
npm run dev                # Backend only
npm run client             # Frontend only

# Production
npm run build              # Build frontend for production
npm start                  # Start production server

# Frontend specific
npm run client:install     # Install frontend dependencies
npm run client:build       # Build frontend
```

## 🧪 Testing

### Testnet Testing (Recommended)

1. Switch to BSC Testnet in the app
2. Get free tBNB from faucet: https://testnet.binance.org/faucet-smart
3. Test all features safely
4. View transactions on: https://testnet.bscscan.com

### Local Testing

```bash
# Start development servers
npm run dev:all

# Open browser
open http://localhost:3001
```

## 🌐 Network Information

### BSC Mainnet
- **Chain ID**: 56
- **Symbol**: BNB
- **RPC**: https://bsc-dataseed1.binance.org
- **Explorer**: https://bscscan.com

### BSC Testnet
- **Chain ID**: 97
- **Symbol**: tBNB
- **RPC**: https://data-seed-prebsc-1-s1.binance.org:8545
- **Explorer**: https://testnet.bscscan.com
- **Faucet**: https://testnet.binance.org/faucet-smart

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
# Build frontend
npm run build

# Deploy dist/ folder
# Set environment variables:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### Backend (Optional)

```bash
# Deploy to your preferred hosting
# Set environment variables from .env.example
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use for your own projects!

## 🆘 Support

- **Setup Issues**: Check `BSC_WALLET_SETUP.md`
- **Questions**: See documentation files
- **BSC Help**: https://docs.bnbchain.org
- **Supabase Help**: https://supabase.com/docs

## 🙏 Acknowledgments

- Inspired by Phantom Wallet's beautiful UI
- Built with open-source technologies
- Powered by BNB Smart Chain

---

**Ready to start?** Run `npm run setup && npm run dev:all` and open http://localhost:3001
