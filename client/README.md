# BSC Phantom Wallet - Frontend

A beautiful, modern crypto wallet interface for BNB Smart Chain, inspired by Phantom wallet design.

## Features

- **Wallet Management**: Create or import multiple wallets
- **BSC Integration**: Full BNB Smart Chain mainnet and testnet support
- **Secure Storage**: Encrypted private keys with password protection
- **Transaction History**: View all your past transactions
- **Token Support**: Manage BEP-20 tokens
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Balance**: Auto-updating balance display

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **TailwindCSS**: Utility-first CSS framework
- **Ethers.js**: Ethereum/BSC blockchain interaction
- **Supabase**: Backend database and authentication
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing

## Getting Started

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### 4. Build for Production

```bash
npm run build
```

## Features Overview

### Wallet Creation
- Generate new wallets with secure seed phrases
- 12-word mnemonic backup
- Password-protected private key encryption

### Wallet Import
- Import existing wallets via seed phrase or private key
- Support for multiple wallet accounts
- Easy wallet switching

### Send & Receive
- Send BNB to any address
- Copy your address to receive funds
- Real-time transaction status
- Gas estimation

### Token Management
- View all BEP-20 tokens
- Add custom tokens
- Token balance tracking
- Price display in USD

### Transaction History
- View all past transactions
- Filter by transaction type
- Click to view on BSCScan
- Real-time status updates

## Network Configuration

The wallet supports both BSC Mainnet and Testnet:

- **Mainnet**: Production network with real BNB
- **Testnet**: Test network for development (get free tBNB from faucet)

Switch networks from the header menu.

## Security Best Practices

1. **Never share your seed phrase** - Anyone with your seed phrase can access your funds
2. **Use strong passwords** - Minimum 8 characters for wallet encryption
3. **Backup your seed phrase** - Write it down and store it safely
4. **Verify addresses** - Always double-check recipient addresses before sending
5. **Start with testnet** - Test all features on testnet before using mainnet

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── BalanceCard.jsx
│   │   ├── TokenList.jsx
│   │   ├── TransactionList.jsx
│   │   ├── WalletHeader.jsx
│   │   └── WalletSelector.jsx
│   ├── config/          # Configuration files
│   │   ├── bsc.js       # BSC network config
│   │   └── supabase.js  # Supabase client setup
│   ├── pages/           # Page components
│   │   ├── AuthPage.jsx
│   │   ├── CreateWalletPage.jsx
│   │   ├── ImportWalletPage.jsx
│   │   ├── SendPage.jsx
│   │   └── WalletPage.jsx
│   ├── store/           # State management
│   │   ├── authStore.js
│   │   └── walletStore.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies
```

## Database Schema

The wallet uses Supabase with the following tables:

### wallets
- User wallet addresses and encrypted keys
- Multiple wallets per user support
- Primary wallet designation

### transactions
- Transaction history
- Status tracking (pending/confirmed/failed)
- Gas information

### tokens
- Custom token balances
- Token metadata
- Visibility settings

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Issue: White screen on load
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase credentials are valid

### Issue: Transactions failing
- Check wallet has sufficient BNB for gas
- Verify you're on the correct network
- Check recipient address is valid

### Issue: Balance not updating
- Click refresh button on balance card
- Check internet connection
- Verify RPC endpoint is accessible

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed information
- Include browser console logs for errors

## License

MIT License - feel free to use this project for your own purposes.
