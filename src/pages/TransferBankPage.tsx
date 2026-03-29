import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { PinModal } from '../components/PinModal';
export function TransferBankPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    routing_number: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError('');
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (
    !form.bank_name ||
    !form.account_name ||
    !form.account_number ||
    !amount)
    {
      setError('Please fill in all required fields.');
      return;
    }
    if (amount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (amount > (user?.balance || 0)) {
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
    const amount = parseFloat(form.amount);
    const ref = 'TXN' + Date.now().toString(36).toUpperCase();
    const { error: txError } = await supabase.from('transactions').insert({
      user_id: user!.id,
      type: 'bank_transfer',
      description: `Transfer to ${form.account_name} - ${form.bank_name} (Pending Review)`,
      amount: -amount,
      status: 'pending',
      reference: ref,
      recipient_details: `${form.account_name} | ${form.bank_name} | ${form.account_number}`
    });
    setLoading(false);
    if (txError) {
      setError(txError.message);
      return;
    }
    navigate('/dashboard');
  }
  return (
    <DashboardLayout showBackToDashboard title="Transfer to Bank">
      <div className="max-w-lg">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          {error &&
          <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Bank Name *
              </label>
              <input
                name="bank_name"
                value={form.bank_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]"
                required />
              
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                Account Name *
              </label>
              <input
                name="account_name"
                value={form.account_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]"
                required />
              
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                Account Number *
              </label>
              <input
                name="account_number"
                value={form.account_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]"
                required />
              
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                Routing Number
              </label>
              <input
                name="routing_number"
                value={form.routing_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" />
              
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                Amount (USD) *
              </label>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={handleChange}
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
              
              {loading ? 'Processing...' : 'Transfer'}
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