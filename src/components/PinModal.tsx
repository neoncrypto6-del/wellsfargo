import React, { useEffect, useState, useRef } from 'react';
import { XIcon, LockIcon } from 'lucide-react';
import { useAuth } from '../lib/auth';
interface PinModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}
export function PinModal({
  onSuccess,
  onCancel
}: PinModalProps) {
  const {
    user
  } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);
  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    if (newPin.every((d) => d !== '') && index === 3) {
      const entered = newPin.join('');
      if (entered === user?.pin) {
        onSuccess();
      } else {
        setError('Incorrect PIN. Please try again.');
        setPin(['', '', '', '']);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      }
    }
  }
  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LockIcon className="w-5 h-5 text-[#D71E28]" />
            <h2 className="text-xl font-bold text-[#2D2D2D]">Enter PIN</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#666] mb-6">
          Enter your 4-digit PIN to continue
        </p>

        <div className="flex justify-center gap-4 mb-6">
          {pin.map((digit, i) => <input key={i} ref={inputRefs[i]} type="password" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#D71E28] focus:outline-none transition-colors" />)}
        </div>

        {error && <p className="text-sm text-[#D71E28] text-center mb-4">{error}</p>}

        <button onClick={onCancel} className="w-full py-2 text-[#666] hover:text-[#2D2D2D] transition-colors text-sm">
          Cancel
        </button>
      </div>
    </div>;
}