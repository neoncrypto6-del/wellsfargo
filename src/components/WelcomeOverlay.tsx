import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
export function WelcomeOverlay() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Your dashboard has been updated with the latest information. You can securely manage your accounts, transfer funds, and explore new financial tools.'
  );
  useEffect(() => {
    if (user) {
      const hasSeenWelcome = sessionStorage.getItem('wf_has_seen_welcome');
      if (!hasSeenWelcome) {
        setIsVisible(true);
        sessionStorage.setItem('wf_has_seen_welcome', 'true');
        fetchWelcomeMessage();
      }
    }
  }, [user]);
  async function fetchWelcomeMessage() {
    try {
      const { data, error } = await supabase.
      from('site_settings').
      select('value').
      eq('key', 'welcome_message').
      single();
      if (data && data.value) {
        setWelcomeMessage(data.value);
      }
    } catch (err) {
      console.error('Error fetching welcome message:', err);
    }
  }
  if (!isVisible || !user) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setIsVisible(false)}>
      
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}>
        
        <div className="bg-[#D71E28] p-6 text-white relative">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            
            <XIcon className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-1">
            Welcome, {user.full_name}!
          </h2>
          <p className="text-red-100 text-sm">We're glad to have you back.</p>
        </div>
        <div className="p-6">
          <p className="text-[#2D2D2D] text-sm leading-relaxed mb-6">
            {welcomeMessage}
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="w-full bg-[#F5F5F5] text-[#2D2D2D] border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
            
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>);

}