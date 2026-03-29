import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { TransactionReceipt } from '../components/TransactionReceipt';
import { SendIcon, DownloadIcon, WalletIcon } from 'lucide-react';
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
export function TransactionHistoryPage() {
  const {
    user
  } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) fetchAll();
  }, [user]);
  async function fetchAll() {
    const {
      data
    } = await supabase.from('transactions').select('*').eq('user_id', user!.id).order('created_at', {
      ascending: false
    });
    setTransactions(data || []);
    setLoading(false);
  }
  return <DashboardLayout showBackToDashboard title="Transaction History">
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
            </div> : transactions.length === 0 ? <div className="text-center py-20 text-[#666]">
              <WalletIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No transactions yet</p>
            </div> : <div>
              {transactions.map((tx) => <button key={tx.id} onClick={() => setSelectedTx(tx)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      {tx.amount > 0 ? <DownloadIcon className="w-4 h-4 text-green-600" /> : <SendIcon className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-[#2D2D2D] text-sm">
                        {tx.description}
                      </p>
                      <p className="text-xs text-[#666]">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-[#2D2D2D]'}`}>
                      {tx.amount > 0 ? '+' : '-'}$
                      {Math.abs(tx.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 2
                })}
                    </p>
                    <p className={`text-xs capitalize ${tx.status === 'completed' ? 'text-green-500' : tx.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                      {tx.status}
                    </p>
                  </div>
                </button>)}
            </div>}
        </div>
      </div>
      {selectedTx && <TransactionReceipt transaction={selectedTx} onClose={() => setSelectedTx(null)} />}
    </DashboardLayout>;
}