import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { TransactionReceipt } from '../components/TransactionReceipt';
import { WelcomeOverlay } from '../components/WelcomeOverlay';
import { SendIcon, DownloadIcon, CreditCardIcon, LandmarkIcon, TrendingUpIcon, ReceiptIcon, FileTextIcon, ArrowRightIcon, WalletIcon } from 'lucide-react';
interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  reference?: string;
  recipient_details?: string;
  created_at: string;
}
export function DashboardPage() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      fetchTransactions();
      // Subscribe to realtime transaction changes
      const channel = supabase.channel('public:transactions').on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchTransactions();
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  async function fetchTransactions() {
    setLoading(true);
    const {
      data
    } = await supabase.from('transactions').select('*').eq('user_id', user!.id).order('created_at', {
      ascending: false
    }).limit(10); // Fetch more for the dashboard
    setTransactions(data || []);
    setLoading(false);
  }
  if (!user) return null;
  const actions = [{
    label: 'Transfer',
    icon: SendIcon,
    path: '/transfer',
    color: 'bg-blue-50 text-blue-600'
  }, {
    label: 'Deposit',
    icon: DownloadIcon,
    path: '/deposit',
    color: 'bg-green-50 text-green-600'
  }, {
    label: 'Cards',
    icon: CreditCardIcon,
    path: '/cards',
    color: 'bg-purple-50 text-purple-600'
  }, {
    label: 'Loan',
    icon: LandmarkIcon,
    path: '/loans',
    color: 'bg-orange-50 text-orange-600'
  }, {
    label: 'Invest',
    icon: TrendingUpIcon,
    path: '/invest',
    color: 'bg-teal-50 text-teal-600'
  }, {
    label: 'Bills',
    icon: ReceiptIcon,
    path: '/bills',
    color: 'bg-pink-50 text-pink-600'
  }, {
    label: 'Statement',
    icon: FileTextIcon,
    path: '/statements',
    color: 'bg-indigo-50 text-indigo-600'
  }];
  return <DashboardLayout>
      <WelcomeOverlay />

      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#2D2D2D]">
          Welcome, {user.full_name?.split(' ')[0]}!
        </h1>
      </div>

      {/* Account Card - Compact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-5">
        <div className="flex justify-between items-start mb-1">
          <span className="inline-block px-2 py-0.5 bg-[#D71E28] text-white text-[10px] font-semibold rounded uppercase tracking-wide">
            {user.account_type}
          </span>
        </div>
        <p className="text-3xl font-bold text-[#2D2D2D] mb-1">
          $
          {(user.balance || 0).toLocaleString('en-US', {
          minimumFractionDigits: 2
        })}
        </p>
        <p className="text-xs text-[#666] font-mono">
          Acct: ****{user.account_number?.slice(-4) || '0000'}
        </p>
      </div>

      {/* Quick Actions - Compact Grid */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-6">
        {actions.map((action) => <button key={action.label} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-1.5 bg-white rounded-lg border border-gray-200 py-3 px-1 hover:shadow-sm hover:border-gray-300 transition-all">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.color}`}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-[#2D2D2D]">
              {action.label}
            </span>
          </button>)}
      </div>

      {/* Transaction History - Compact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-[#2D2D2D]">
            Recent Transactions
          </h2>
          <button onClick={() => navigate('/transactions')} className="flex items-center gap-1 text-xs text-[#D71E28] font-medium hover:underline">
            See All <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>

        {loading ? <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
          </div> : transactions.length === 0 ? <div className="text-center py-8 text-[#666]">
            <WalletIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No transactions yet</p>
          </div> : <div className="divide-y divide-gray-50">
            {transactions.map((tx) => <button key={tx.id} onClick={() => setSelectedTx(tx)} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.amount > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    {tx.amount > 0 ? <DownloadIcon className="w-3.5 h-3.5 text-green-600" /> : <SendIcon className="w-3.5 h-3.5 text-red-600" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#2D2D2D] text-xs truncate max-w-[150px] md:max-w-[300px]">
                      {tx.description}
                    </p>
                    <p className="text-[10px] text-[#666]">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className={`font-semibold text-xs ${tx.amount > 0 ? 'text-green-600' : 'text-[#2D2D2D]'}`}>
                    {tx.amount > 0 ? '+' : '-'}$
                    {Math.abs(tx.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2
              })}
                  </p>
                  <p className={`text-[10px] capitalize ${tx.status === 'completed' ? 'text-green-500' : tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {tx.status}
                  </p>
                </div>
              </button>)}
          </div>}
      </div>

      {selectedTx && <TransactionReceipt transaction={selectedTx} onClose={() => setSelectedTx(null)} />}
    </DashboardLayout>;
}