import React, { useState } from "react";
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { DownloadIcon } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  reference?: string;
  created_at: string;
}

export function StatementsPage() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);

    // Convert local date strings to UTC ISO for consistent querying
    // Start of day (00:00:00 UTC)
    const startISO = `${startDate}T00:00:00Z`;
    // End of day (23:59:59 UTC)
    const endISO = `${endDate}T23:59:59Z`;

    const { data, error } = await supabase.
    from('transactions').
    select('*').
    eq('user_id', user!.id).
    gte('created_at', startISO).
    lte('created_at', endISO).
    order('created_at', { ascending: false });

    if (error) {
      console.error('Query error:', error);
    }

    setTransactions(data || []);
    setGenerated(true);
    setLoading(false);
  }

  function handleDownload() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalCredit = transactions.
    filter((t) => t.amount > 0).
    reduce((s, t) => s + t.amount, 0);
    const totalDebit = transactions.
    filter((t) => t.amount < 0).
    reduce((s, t) => s + Math.abs(t.amount), 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Account Statement</title>
          <style>
            body { font-family: -apple-system, sans-serif; padding: 40px; color: #2D2D2D; }
            h1 { color: #D71E28; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
            th { background: #f5f5f5; font-weight: 600; }
            .credit { color: green; }
            .debit { color: #2D2D2D; }
            .summary { margin-top: 20px; display: flex; gap: 40px; flex-wrap: wrap; }
            .summary div { padding: 10px; background: #f5f5f5; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>WELLS FARGO</h1>
          <h2>Account Statement</h2>
          <p><strong>Account Holder:</strong> ${user!.full_name}</p>
          <p><strong>Account Number:</strong> ${user!.account_number}</p>
          <p><strong>Period:</strong> ${startDate} to ${endDate}</p>
          <div class="summary">
            <div><strong>Total Credits:</strong> $${totalCredit.toFixed(2)}</div>
            <div><strong>Total Debits:</strong> $${totalDebit.toFixed(2)}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Description</th><th>Type</th><th>Reference</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.
    map(
      (t) => `
                    <tr>
                      <td>${new Date(t.created_at).toLocaleDateString()}</td>
                      <td>${t.description}</td>
                      <td style="text-transform:capitalize">${t.type.replace(/_/g, ' ')}</td>
                      <td>${t.reference || '-'}</td>
                      <td class="${t.amount > 0 ? 'credit' : 'debit'}">
                        ${t.amount > 0 ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}
                      </td>
                      <td style="text-transform:capitalize">${t.status}</td>
                    </tr>
                  `
    ).
    join('')}
            </tbody>
          </table>
          <p style="margin-top:30px;font-size:11px;color:#666;">
            Generated on ${new Date().toLocaleString()} | Wells Fargo Bank, N.A. Member FDIC
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <DashboardLayout showBackToDashboard title="Account Statements">
      <div className="max-w-3xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <form
            onSubmit={handleGenerate}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-4">
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]"
                required />
              
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]"
                required />
              
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#D71E28] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50 sm:w-auto w-full mt-2 sm:mt-0">
              
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>

        {generated &&
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-100 gap-4">
              <h2 className="font-bold text-[#2D2D2D] text-lg">
                Statement: {startDate} to {endDate}
              </h2>
              <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-[#D71E28] font-medium hover:underline whitespace-nowrap">
              
                <DownloadIcon className="w-4 h-4" /> Download PDF
              </button>
            </div>

            {transactions.length === 0 ?
          <div className="p-12 text-center text-[#666]">
                No transactions found for this period.
              </div> :

          <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th className="text-left p-3 font-semibold text-[#2D2D2D]">Date</th>
                      <th className="text-left p-3 font-semibold text-[#2D2D2D]">Description</th>
                      <th className="text-left p-3 font-semibold text-[#2D2D2D]">Type</th>
                      <th className="text-right p-3 font-semibold text-[#2D2D2D]">Amount</th>
                      <th className="text-left p-3 font-semibold text-[#2D2D2D]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) =>
                <tr key={tx.id} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="p-3 text-[#666]">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-[#2D2D2D]">{tx.description}</td>
                        <td className="p-3 text-[#666] capitalize">
                          {tx.type.replace(/_/g, ' ')}
                        </td>
                        <td
                    className={`p-3 text-right font-semibold ${
                    tx.amount > 0 ? 'text-green-600' : 'text-[#2D2D2D]'}`
                    }>
                    
                          {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="p-3 capitalize text-[#666]">{tx.status}</td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>
          }
          </div>
        }
      </div>
    </DashboardLayout>);

}