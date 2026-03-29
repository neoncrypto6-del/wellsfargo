import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase, CRYPTO_WALLETS } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
export function TransferCryptoPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!selectedCrypto || !walletAddress || !amt) {
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
      executeTransfer();
    }
  }
  async function executeTransfer() {
    setShowPin(false);
    setLoading(true);
    const amt = parseFloat(amount);
    const ref = 'CRY' + Date.now().toString(36).toUpperCase();
    const { error: txError } = await supabase.from('transactions').insert({
      user_id: user!.id,
      type: 'crypto_transfer',
      description: `Crypto transfer - ${selectedCrypto} (Pending Review)`,
      amount: -amt,
      status: 'pending',
      reference: ref,
      recipient_details: `${selectedCrypto} | ${walletAddress}`
    });
    setLoading(false);
    if (txError) {
      setError(txError.message);
      return;
    }
    navigate('/dashboard');
  }
  const cryptoList = Object.entries(CRYPTO_WALLETS);
  return (
    <DashboardLayout showBackToDashboard title="Transfer Crypto">
      <div className="max-w-lg">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          {error &&
          <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                Cryptocurrency *
              </label>
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] bg-white"
                required>
                
                <option value="">Select cryptocurrency</option>
                {cryptoList.map(([key, info]) =>
                <option key={key} value={key}>
                    {info.name} ({info.symbol})
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                Wallet Address *
              </label>
              <input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]"
                required />
              
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                Amount (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]"
                required />
              
              <p className="text-[10px] text-[#666] mt-1">
                Available: $
                {(user?.balance || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2
                })}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D71E28] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
              
              {loading ? 'Processing...' : 'Transfer Crypto'}
            </button>
          </form>
        </div>
      </div>
      {showPin &&
      <PinModal
        onSuccess={executeTransfer}
        onCancel={() => setShowPin(false)} />

      }
    </DashboardLayout>);

}