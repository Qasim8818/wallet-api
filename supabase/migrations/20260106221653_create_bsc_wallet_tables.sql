/*
  # BSC Phantom Wallet Database Schema

  1. New Tables
    - `wallets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `address` (text, unique) - BSC wallet address
      - `encrypted_private_key` (text) - Encrypted private key
      - `name` (text) - Wallet name
      - `is_primary` (boolean) - Primary wallet flag
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `wallet_id` (uuid, references wallets)
      - `tx_hash` (text, unique) - Transaction hash
      - `from_address` (text)
      - `to_address` (text)
      - `amount` (numeric) - Amount in BNB
      - `token_address` (text) - For token transfers
      - `token_symbol` (text)
      - `token_decimals` (integer)
      - `gas_used` (numeric)
      - `gas_price` (numeric)
      - `status` (text) - pending, confirmed, failed
      - `block_number` (bigint)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)
    
    - `tokens`
      - `id` (uuid, primary key)
      - `wallet_id` (uuid, references wallets)
      - `contract_address` (text)
      - `symbol` (text)
      - `name` (text)
      - `decimals` (integer)
      - `balance` (numeric)
      - `price_usd` (numeric)
      - `is_visible` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own wallet data
    - Strict authentication requirements
*/

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address text UNIQUE NOT NULL,
  encrypted_private_key text NOT NULL,
  name text NOT NULL DEFAULT 'Wallet 1',
  is_primary boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  tx_hash text UNIQUE NOT NULL,
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  token_address text,
  token_symbol text,
  token_decimals integer,
  gas_used numeric,
  gas_price numeric,
  status text NOT NULL DEFAULT 'pending',
  block_number bigint,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  contract_address text NOT NULL,
  symbol text NOT NULL,
  name text NOT NULL,
  decimals integer NOT NULL DEFAULT 18,
  balance numeric NOT NULL DEFAULT 0,
  price_usd numeric DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(wallet_id, contract_address)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tokens_wallet_id ON tokens(wallet_id);

-- Enable Row Level Security
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallets"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallets"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets"
  ON wallets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their wallet transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transactions for their wallets"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for tokens
CREATE POLICY "Users can view their wallet tokens"
  ON tokens FOR SELECT
  TO authenticated
  USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tokens in their wallets"
  ON tokens FOR INSERT
  TO authenticated
  WITH CHECK (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tokens in their wallets"
  ON tokens FOR UPDATE
  TO authenticated
  USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tokens from their wallets"
  ON tokens FOR DELETE
  TO authenticated
  USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );