import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  LandmarkIcon,
  BitcoinIcon,
  GiftIcon,
  SmartphoneIcon,
  CopyIcon,
  CheckIcon } from
'lucide-react';
export function DepositPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);
  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }
  if (!user) return null;
  return (
    <DashboardLayout showBackToDashboard title="Deposit Funds">
      <div className="space-y-6 max-w-3xl">
        {/* Bank Transfer - Show details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <LandmarkIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2D2D2D]">
                Bank Transfer
              </h3>
              <p className="text-sm text-[#666]">
                Use these details to receive deposits
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
            {
              label: 'Account Name',
              value: user.full_name
            },
            {
              label: 'Bank Name',
              value: user.bank_name || 'Wells Fargo'
            },
            {
              label: 'Account Number',
              value: user.account_number
            },
            {
              label: 'Routing Number',
              value: user.routing_number
            }].
            map((item) =>
            <div
              key={item.label}
              className="bg-[#F5F5F5] rounded-lg p-4 flex items-center justify-between">
              
                <div>
                  <p className="text-xs text-[#666]">{item.label}</p>
                  <p className="font-mono font-semibold text-[#2D2D2D]">
                    {item.value}
                  </p>
                </div>
                <button
                onClick={() => copyToClipboard(item.value || '', item.label)}
                className="text-gray-400 hover:text-[#D71E28] transition-colors">
                
                  {copied === item.label ?
                <CheckIcon className="w-4 h-4 text-green-500" /> :

                <CopyIcon className="w-4 h-4" />
                }
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Other deposit options */}
        <div className="flex flex-row gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => navigate('/deposit/crypto')}
            className="min-w-[160px] flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-3 text-left">
            
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <BitcoinIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2D2D2D]">Crypto</h3>
              <p className="text-xs text-[#666]">Via wallet</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/deposit/gift-card')}
            className="min-w-[160px] flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-3 text-left">
            
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
              <GiftIcon className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2D2D2D]">Gift Card</h3>
              <p className="text-xs text-[#666]">Redeem card</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/deposit/cashapp')}
            className="min-w-[160px] flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-3 text-left">
            
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <SmartphoneIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2D2D2D]">Cash App</h3>
              <p className="text-xs text-[#666]">Via Cash App</p>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>);

}