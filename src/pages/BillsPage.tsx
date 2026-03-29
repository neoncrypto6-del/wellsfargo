import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
import { ZapIcon, DropletIcon, WifiIcon, PhoneIcon, ShieldIcon, HomeIcon, TvIcon, FlameIcon } from 'lucide-react';
const BILL_CATEGORIES = [{
  name: 'Electricity',
  icon: ZapIcon,
  color: 'bg-yellow-50 text-yellow-600'
}, {
  name: 'Water',
  icon: DropletIcon,
  color: 'bg-blue-50 text-blue-600'
}, {
  name: 'Internet',
  icon: WifiIcon,
  color: 'bg-purple-50 text-purple-600'
}, {
  name: 'Phone',
  icon: PhoneIcon,
  color: 'bg-green-50 text-green-600'
}, {
  name: 'Insurance',
  icon: ShieldIcon,
  color: 'bg-red-50 text-red-600'
}, {
  name: 'Rent',
  icon: HomeIcon,
  color: 'bg-orange-50 text-orange-600'
}, {
  name: 'Cable TV',
  icon: TvIcon,
  color: 'bg-indigo-50 text-indigo-600'
}, {
  name: 'Gas',
  icon: FlameIcon,
  color: 'bg-pink-50 text-pink-600'
}];
export function BillsPage() {
  const navigate = useNavigate();
  const {
    user,
    refreshUser
  } = useAuth();
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [provider, setProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!provider || !accountNumber || !amt) {
      setError('Please fill in all fields.');
      return;
    }
    if (amt <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (amt > (user?.balance || 0)) {
      setError('Insufficient balance.');
      return;
    }
    if (user?.pin) {
      setShowPin(true);
    } else {
      executePay();
    }
  }
  async function executePay() {
    setShowPin(false);
    setLoading(true);
    const amt = parseFloat(amount);
    const ref = 'BIL' + Date.now().toString(36).toUpperCase();
    await supabase.from('transactions').insert({
      user_id: user!.id,
      type: 'bill_payment',
      description: `${selectedBill} bill - ${provider}`,
      amount: -amt,
      status: 'completed',
      reference: ref,
      recipient_details: `${provider} | Acct: ${accountNumber}`
    });
    await supabase.from('users').update({
      balance: (user!.balance || 0) - amt
    }).eq('id', user!.id);
    await refreshUser();
    setLoading(false);
    navigate('/dashboard');
  }
  return <DashboardLayout showBackToDashboard title="Pay Bills">
      <div className="max-w-2xl">
        {!selectedBill ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BILL_CATEGORIES.map((bill) => <button key={bill.name} onClick={() => {
          setSelectedBill(bill.name);
          setError('');
        }} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bill.color}`}>
                  <bill.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-[#2D2D2D]">
                  {bill.name}
                </span>
              </button>)}
          </div> : <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <button onClick={() => setSelectedBill(null)} className="text-sm text-[#D71E28] hover:underline mb-4 block">
              ← Back to categories
            </button>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">
              Pay {selectedBill} Bill
            </h2>

            {error && <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>}

            <form onSubmit={handlePay} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Provider *
                </label>
                <input value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Account Number *
                </label>
                <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Amount (USD) *
                </label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" required />
                <p className="text-xs text-[#666] mt-1">
                  Available: $
                  {(user?.balance || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2
              })}
                </p>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : 'Pay Bill'}
              </button>
            </form>
          </div>}
      </div>
      {showPin && <PinModal onSuccess={executePay} onCancel={() => setShowPin(false)} />}
    </DashboardLayout>;
}