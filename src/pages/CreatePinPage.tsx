import React, { useState, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { LockIcon, CheckCircleIcon } from 'lucide-react';
export function CreatePinPage() {
  const {
    user,
    refreshUser
  } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const confirmRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  function handlePinChange(index: number, value: string, isConfirm: boolean) {
    if (!/^\d*$/.test(value)) return;
    const setter = isConfirm ? setConfirmPin : setPin;
    const refs = isConfirm ? confirmRefs : pinRefs;
    const current = isConfirm ? [...confirmPin] : [...pin];
    current[index] = value.slice(-1);
    setter(current);
    if (value && index < 3) refs[index + 1].current?.focus();
  }
  function handleKeyDown(index: number, e: React.KeyboardEvent, isConfirm: boolean) {
    const current = isConfirm ? confirmPin : pin;
    const refs = isConfirm ? confirmRefs : pinRefs;
    if (e.key === 'Backspace' && !current[index] && index > 0) refs[index - 1].current?.focus();
  }
  function handleNext() {
    if (pin.some((d) => d === '')) {
      setError('Please enter all 4 digits.');
      return;
    }
    setError('');
    setStep('confirm');
    setTimeout(() => confirmRefs[0].current?.focus(), 100);
  }
  async function handleSubmit() {
    if (confirmPin.some((d) => d === '')) {
      setError('Please confirm all 4 digits.');
      return;
    }
    if (pin.join('') !== confirmPin.join('')) {
      setError('PINs do not match.');
      setConfirmPin(['', '', '', '']);
      return;
    }
    setLoading(true);
    setError('');
    await supabase.from('users').update({
      pin: pin.join('')
    }).eq('id', user!.id);
    await refreshUser();
    setLoading(false);
    setSuccess(true);
  }
  return <DashboardLayout showBackToDashboard title="Create PIN">
      <div className="max-w-sm mx-auto">
        {success ? <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">
              PIN Created
            </h2>
            <p className="text-[#666]">
              Your transaction PIN has been set successfully.
            </p>
          </div> : <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <LockIcon className="w-6 h-6 text-[#D71E28]" />
              <h2 className="text-xl font-bold text-[#2D2D2D]">
                {step === 'create' ? 'Enter 4-Digit PIN' : 'Confirm PIN'}
              </h2>
            </div>

            {user?.pin && <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6 text-sm">
                You already have a PIN set. Creating a new one will replace it.
              </div>}

            {error && <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>}

            <div className="flex justify-center gap-4 mb-8">
              {(step === 'create' ? pin : confirmPin).map((digit, i) => <input key={i} ref={(step === 'create' ? pinRefs : confirmRefs)[i]} type="password" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handlePinChange(i, e.target.value, step === 'confirm')} onKeyDown={(e) => handleKeyDown(i, e, step === 'confirm')} className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#D71E28] focus:outline-none transition-colors" />)}
            </div>

            {step === 'create' ? <button onClick={handleNext} className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors">
                Next
              </button> : <div className="space-y-3">
                <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create PIN'}
                </button>
                <button onClick={() => {
            setStep('create');
            setConfirmPin(['', '', '', '']);
            setError('');
          }} className="w-full py-2 text-[#666] hover:text-[#2D2D2D] text-sm">
                  Go Back
                </button>
              </div>}
          </div>}
      </div>
    </DashboardLayout>;
}