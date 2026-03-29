import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase, CRYPTO_WALLETS } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
import { TrendingUpIcon } from 'lucide-react';
const MOCK_PRICES: Record<string, number> = {
  BTC: 67432.50,
  ETH: 3521.80,
  SOL: 142.65,
  BNB: 598.30,
  USDT: 1.00,
  USDC: 1.00,
  DOGE: 0.124,
  TRX: 0.118,
  XRP: 0.527,
  LTC: 84.20
};
export function InvestPage() {
  const navigate = useNavigate();
  const {
    user,
    refreshUser
  } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  function handleInvest() {
    const amt = parseFloat(amount);
    if (!selectedCrypto || !amt) {
      setError('Select a crypto and enter an amount.');
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
      executeInvest();
    }
  }
  async function executeInvest() {
    setShowPin(false);
    setLoading(true);
    const amt = parseFloat(amount);
    const info = CRYPTO_WALLETS[selectedCrypto];
    const ref = 'INV' + Date.now().toString(36).toUpperCase();
    await supabase.from('transactions').insert({
      user_id: user!.id,
      type: 'investment',
      description: `Investment in ${info?.name || selectedCrypto}`,
      amount: -amt,
      status: 'completed',
      reference: ref
    });
    await supabase.from('users').update({
      balance: (user!.balance || 0) - amt
    }).eq('id', user!.id);
    await refreshUser();
    setLoading(false);
    navigate('/dashboard');
  }
  const cryptoList = Object.entries(CRYPTO_WALLETS);
  return <DashboardLayout showBackToDashboard title="Invest">
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <p className="text-sm text-[#666] mb-4">
            Select a cryptocurrency to invest in. Prices are indicative and may
            vary.
          </p>
          {error && <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>}

          <div className="space-y-3 mb-6">
            {cryptoList.map(([key, info]) => <button key={key} onClick={() => {
            setSelectedCrypto(key);
            setError('');
          }} className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${selectedCrypto === key ? 'border-[#D71E28] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-3">
                  <TrendingUpIcon className={`w-5 h-5 ${selectedCrypto === key ? 'text-[#D71E28]' : 'text-[#666]'}`} />
                  <span className="font-medium text-[#2D2D2D]">{info.name} ({info.symbol})</span>
                </div>
                <span className="font-semibold text-[#2D2D2D]">
                  $
                  {MOCK_PRICES[key]?.toLocaleString('en-US', {
                minimumFractionDigits: 2
              }) || 'N/A'}
                </span>
              </button>)}
          </div>

          {selectedCrypto && <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Amount to Invest (USD)
              </label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] mb-2" />
              <p className="text-xs text-[#666] mb-4">
                Available: $
                {(user?.balance || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
              </p>
              <button onClick={handleInvest} disabled={loading} className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : 'Invest Now'}
              </button>
            </div>}
        </div>
      </div>
      {showPin && <PinModal onSuccess={executeInvest} onCancel={() => setShowPin(false)} />}
    </DashboardLayout>;
}