import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { LandmarkIcon, BitcoinIcon } from 'lucide-react';
export function TransferPage() {
  const navigate = useNavigate();
  return (
    <DashboardLayout showBackToDashboard title="Transfer Funds">
      <div className="flex flex-row gap-4 max-w-2xl">
        <button
          onClick={() => navigate('/transfer/bank')}
          className="min-w-[160px] flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-3 text-left">
          
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <LandmarkIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D2D2D]">
              Transfer to Bank
            </h3>
          </div>
        </button>

        <button
          onClick={() => navigate('/transfer/crypto')}
          className="min-w-[160px] flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-3 text-left">
          
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
            <BitcoinIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D2D2D]">
              Transfer in Crypto
            </h3>
          </div>
        </button>
      </div>
    </DashboardLayout>);

}