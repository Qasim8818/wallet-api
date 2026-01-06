import { create } from 'zustand'
import { supabase } from '../config/supabase'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { BSC_CONFIG, DEFAULT_NETWORK } from '../config/bsc'

export const useWalletStore = create((set, get) => ({
  wallets: [],
  currentWallet: null,
  balance: '0',
  tokens: [],
  transactions: [],
  loading: false,
  network: DEFAULT_NETWORK,

  setNetwork: (network) => set({ network }),

  loadWallets: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      toast.error('Failed to load wallets')
      set({ loading: false })
      return
    }

    set({
      wallets: data,
      currentWallet: data.find(w => w.is_primary) || data[0] || null,
      loading: false
    })

    if (data.length > 0) {
      get().loadBalance()
      get().loadTokens()
      get().loadTransactions()
    }
  },

  createWallet: async (name, password) => {
    set({ loading: true })
    try {
      const wallet = ethers.Wallet.createRandom()
      const encryptedKey = await wallet.encrypt(password)

      const { data, error } = await supabase
        .from('wallets')
        .insert([{
          address: wallet.address,
          encrypted_private_key: encryptedKey,
          name: name || 'Wallet 1',
          is_primary: get().wallets.length === 0
        }])
        .select()
        .single()

      if (error) throw error

      set(state => ({
        wallets: [...state.wallets, data],
        currentWallet: data,
        loading: false
      }))

      toast.success('Wallet created successfully!')
      return { wallet: data, mnemonic: wallet.mnemonic.phrase }
    } catch (error) {
      toast.error(error.message)
      set({ loading: false })
      return { error }
    }
  },

  importWallet: async (privateKeyOrMnemonic, name, password) => {
    set({ loading: true })
    try {
      let wallet
      if (privateKeyOrMnemonic.split(' ').length >= 12) {
        wallet = ethers.Wallet.fromMnemonic(privateKeyOrMnemonic)
      } else {
        wallet = new ethers.Wallet(privateKeyOrMnemonic)
      }

      const encryptedKey = await wallet.encrypt(password)

      const { data, error } = await supabase
        .from('wallets')
        .insert([{
          address: wallet.address,
          encrypted_private_key: encryptedKey,
          name: name || 'Imported Wallet',
          is_primary: get().wallets.length === 0
        }])
        .select()
        .single()

      if (error) throw error

      set(state => ({
        wallets: [...state.wallets, data],
        currentWallet: data,
        loading: false
      }))

      toast.success('Wallet imported successfully!')
      return { wallet: data }
    } catch (error) {
      toast.error('Invalid private key or seed phrase')
      set({ loading: false })
      return { error }
    }
  },

  loadBalance: async () => {
    const { currentWallet, network } = get()
    if (!currentWallet) return

    try {
      const provider = new ethers.providers.JsonRpcProvider(
        BSC_CONFIG[network].rpcUrls[0]
      )
      const balance = await provider.getBalance(currentWallet.address)
      set({ balance: ethers.utils.formatEther(balance) })
    } catch (error) {
      console.error('Failed to load balance:', error)
    }
  },

  loadTokens: async () => {
    const { currentWallet } = get()
    if (!currentWallet) return

    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('wallet_id', currentWallet.id)
      .eq('is_visible', true)

    if (!error && data) {
      set({ tokens: data })
    }
  },

  loadTransactions: async () => {
    const { currentWallet } = get()
    if (!currentWallet) return

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', currentWallet.id)
      .order('timestamp', { ascending: false })
      .limit(50)

    if (!error && data) {
      set({ transactions: data })
    }
  },

  sendTransaction: async (to, amount, password) => {
    const { currentWallet, network } = get()
    if (!currentWallet) return { error: 'No wallet selected' }

    set({ loading: true })
    try {
      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
        currentWallet.encrypted_private_key,
        password
      )

      const provider = new ethers.providers.JsonRpcProvider(
        BSC_CONFIG[network].rpcUrls[0]
      )
      const wallet = decryptedWallet.connect(provider)

      const tx = await wallet.sendTransaction({
        to,
        value: ethers.utils.parseEther(amount.toString())
      })

      await supabase
        .from('transactions')
        .insert([{
          wallet_id: currentWallet.id,
          tx_hash: tx.hash,
          from_address: currentWallet.address,
          to_address: to,
          amount: amount,
          status: 'pending'
        }])

      const receipt = await tx.wait()

      await supabase
        .from('transactions')
        .update({
          status: 'confirmed',
          block_number: receipt.blockNumber,
          gas_used: receipt.gasUsed.toString(),
          gas_price: receipt.effectiveGasPrice.toString()
        })
        .eq('tx_hash', tx.hash)

      toast.success('Transaction sent successfully!')
      get().loadBalance()
      get().loadTransactions()
      set({ loading: false })
      return { tx }
    } catch (error) {
      toast.error(error.message)
      set({ loading: false })
      return { error }
    }
  },

  switchWallet: (wallet) => {
    set({ currentWallet: wallet })
    get().loadBalance()
    get().loadTokens()
    get().loadTransactions()
  }
}))
