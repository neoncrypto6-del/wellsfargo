import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { EyeIcon, EyeOffIcon, SnowflakeIcon, RefreshCwIcon, CreditCardIcon } from 'lucide-react';
interface Card {
  id: string;
  card_number: string;
  card_holder_name: string;
  expiry_date: string;
  cvv: string;
  is_frozen: boolean;
  card_type: string;
}
export function CardsPage() {
  const {
    user
  } = useAuth();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    fetchCard();
  }, [user]);
  async function fetchCard() {
    if (!user) return;
    const {
      data
    } = await supabase.from('cards').select('*').eq('user_id', user.id).single();
    setCard(data);
    setLoading(false);
  }
  async function toggleFreeze() {
    if (!card) return;
    setActionLoading(true);
    await supabase.from('cards').update({
      is_frozen: !card.is_frozen
    }).eq('id', card.id);
    setCard({
      ...card,
      is_frozen: !card.is_frozen
    });
    setActionLoading(false);
  }
  async function replaceCard() {
    if (!card) return;
    setActionLoading(true);
    const newNumber = '4' + Array.from({
      length: 15
    }, () => Math.floor(Math.random() * 10)).join('');
    const newExpiry = `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${new Date().getFullYear() + 5 - 2000}`;
    const newCvv = String(Math.floor(100 + Math.random() * 900));
    await supabase.from('cards').update({
      card_number: newNumber,
      expiry_date: newExpiry,
      cvv: newCvv,
      is_frozen: false
    }).eq('id', card.id);
    setCard({
      ...card,
      card_number: newNumber,
      expiry_date: newExpiry,
      cvv: newCvv,
      is_frozen: false
    });
    setActionLoading(false);
  }
  function maskNumber(num: string) {
    return num.replace(/(.{4})/g, '$1 ').trim().replace(/\d(?=\d{4})/g, '•');
  }
  return <DashboardLayout showBackToDashboard title="My Cards">
      <div className="max-w-lg">
        {loading ? <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
          </div> : !card ? <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CreditCardIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-[#666]">No card found for your account.</p>
          </div> : <>
            {/* Card Design */}
            <div className={`relative rounded-2xl p-6 text-white mb-6 overflow-hidden ${card.is_frozen ? 'bg-gradient-to-br from-blue-300 to-blue-500' : 'bg-gradient-to-br from-gray-800 to-gray-900'}`}>
              {card.is_frozen && <div className="absolute inset-0 bg-blue-200/30 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold bg-blue-500/60 px-6 py-2 rounded-full">
                    FROZEN
                  </span>
                </div>}
              <div className="flex justify-between items-start mb-8">
                <span className="text-lg font-bold tracking-wider" style={{
              fontFamily: 'Georgia, serif'
            }}>
                  WELLS FARGO
                </span>
                <span className="text-sm uppercase">
                  {card.card_type || 'Debit'}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-mono tracking-widest mb-6">
                {showDetails ? card.card_number.replace(/(.{4})/g, '$1 ').trim() : maskNumber(card.card_number)}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-300 mb-1">Card Holder</p>
                  <p className="font-semibold">{card.card_holder_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-300 mb-1">Expires</p>
                  <p className="font-semibold">{card.expiry_date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-300 mb-1">CVV</p>
                  <p className="font-semibold">
                    {showDetails ? card.cvv : '•••'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setShowDetails(!showDetails)} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all">
                {showDetails ? <EyeOffIcon className="w-5 h-5 text-[#666]" /> : <EyeIcon className="w-5 h-5 text-[#666]" />}
                <span className="text-xs font-medium text-[#2D2D2D]">
                  {showDetails ? 'Hide' : 'Show'} Details
                </span>
              </button>
              <button onClick={toggleFreeze} disabled={actionLoading} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all disabled:opacity-50">
                <SnowflakeIcon className={`w-5 h-5 ${card.is_frozen ? 'text-blue-500' : 'text-[#666]'}`} />
                <span className="text-xs font-medium text-[#2D2D2D]">
                  {card.is_frozen ? 'Unfreeze' : 'Freeze'} Card
                </span>
              </button>
              <button onClick={replaceCard} disabled={actionLoading} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all disabled:opacity-50">
                <RefreshCwIcon className="w-5 h-5 text-[#666]" />
                <span className="text-xs font-medium text-[#2D2D2D]">
                  Replace Card
                </span>
              </button>
            </div>
          </>}
      </div>
    </DashboardLayout>;
}