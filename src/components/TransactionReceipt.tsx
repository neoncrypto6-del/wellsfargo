import React from 'react';
import { XIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
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
interface TransactionReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}
export function TransactionReceipt({
  transaction,
  onClose
}: TransactionReceiptProps) {
  const isCredit = transaction.amount > 0;
  const statusIcon = transaction.status === 'completed' ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : transaction.status === 'pending' ? <ClockIcon className="w-5 h-5 text-yellow-500" /> : <AlertCircleIcon className="w-5 h-5 text-red-500" />;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#D71E28] text-white p-6 rounded-t-xl flex items-center justify-between">
          <h2 className="text-lg font-bold">Transaction Receipt</h2>
          <button onClick={onClose} className="hover:opacity-80">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Amount */}
        <div className="text-center py-8 border-b border-gray-100">
          <p className={`text-4xl font-bold ${isCredit ? 'text-green-600' : 'text-[#2D2D2D]'}`}>
            {isCredit ? '+' : '-'}$
            {Math.abs(transaction.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            {statusIcon}
            <span className="text-sm capitalize font-medium text-[#666]">
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-[#666]">Type</span>
            <span className="text-sm font-medium text-[#2D2D2D] capitalize">
              {transaction.type.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#666]">Description</span>
            <span className="text-sm font-medium text-[#2D2D2D] text-right max-w-[200px]">
              {transaction.description}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#666]">Date</span>
            <span className="text-sm font-medium text-[#2D2D2D]">
              {new Date(transaction.created_at).toLocaleString()}
            </span>
          </div>
          {transaction.reference && <div className="flex justify-between">
              <span className="text-sm text-[#666]">Reference</span>
              <span className="text-sm font-mono text-[#2D2D2D]">
                {transaction.reference}
              </span>
            </div>}
          {transaction.recipient_details && <div className="flex justify-between">
              <span className="text-sm text-[#666]">Recipient</span>
              <span className="text-sm font-medium text-[#2D2D2D] text-right max-w-[200px]">
                {transaction.recipient_details}
              </span>
            </div>}
          <div className="flex justify-between">
            <span className="text-sm text-[#666]">Transaction ID</span>
            <span className="text-xs font-mono text-[#666]">
              {transaction.id.slice(0, 12)}...
            </span>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button onClick={onClose} className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>;
}