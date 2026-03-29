import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { CheckCircleIcon } from 'lucide-react';
const LOAN_TYPES = ['Personal Loan', 'Auto Loan', 'Home Loan', 'Business Loan', 'Student Loan'];
const DURATIONS = ['6 months', '12 months', '24 months', '36 months', '48 months', '60 months'];
export function LoansPage() {
  const {
    user
  } = useAuth();
  const [loanType, setLoanType] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loanType || !amount || !duration) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const {
      error: insertError
    } = await supabase.from('loan_applications').insert({
      user_id: user!.id,
      loan_type: loanType,
      amount: parseFloat(amount),
      duration,
      status: 'pending'
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSuccess(true);
  }
  return <DashboardLayout showBackToDashboard title="Loan Application">
      <div className="max-w-lg">
        {success ? <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">
              Application Submitted
            </h2>
            <p className="text-[#666]">
              Your loan application is under review. We'll notify you of the
              decision.
            </p>
          </div> : <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                Apply for a Loan
              </h2>
              <p className="text-sm text-[#666]">
                Fill in the details below to submit your loan application.
              </p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Loan Type *
                </label>
                <select value={loanType} onChange={(e) => setLoanType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] bg-white" required>
                  <option value="">Select loan type</option>
                  {LOAN_TYPES.map((t) => <option key={t} value={t}>
                      {t}
                    </option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Loan Amount (USD) *
                </label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Repayment Duration *
                </label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] bg-white" required>
                  <option value="">Select duration</option>
                  {DURATIONS.map((d) => <option key={d} value={d}>
                      {d}
                    </option>)}
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>}
      </div>
    </DashboardLayout>;
}