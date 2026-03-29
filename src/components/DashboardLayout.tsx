import React, { useEffect, useState } from 'react';
import { BellIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { NotificationOverlay } from './NotificationOverlay';
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackToDashboard?: boolean;
}
export function DashboardLayout({
  children,
  title,
  showBackToDashboard = false
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    if (!user) return;
    fetchNotifCount();
    const channel = supabase.
    channel('notif-count').
    on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      },
      () => {
        fetchNotifCount();
      }
    ).
    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  async function fetchNotifCount() {
    if (!user) return;
    const { count } = await supabase.
    from('notifications').
    select('*', {
      count: 'exact',
      head: true
    }).
    eq('user_id', user.id).
    eq('is_read', false);
    setNotifCount(count || 0);
  }
  if (!user) return null;
  return (
    <div
      className="min-h-screen bg-[#F5F5F5] text-sm"
      style={{
        fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      }}>
      
      {/* Compact Top Bar */}
      <div className="bg-[#D71E28] text-white px-3 md:px-6 py-2 flex justify-between items-center sticky top-0 z-40 shadow-sm"
      style={{
        borderBottom: '4px solid #FFCD41',
        outlineOffset: '-2px'
      }}>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80">
          
          <span
            className="text-lg md:text-xl font-bold tracking-wider"
            style={{
              fontFamily: 'Georgia, serif'
            }}>
            
            WELLS FARGO
          </span>
        </button>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative hover:opacity-80 transition-opacity"
            aria-label="Notifications">
            
            <BellIcon className="w-5 h-5 md:w-6 md:h-6" />
            {notifCount > 0 &&
            <span className="absolute -top-1 -right-1 bg-[#FFCD41] text-[#2D2D2D] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            }
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="hover:opacity-80 transition-opacity"
            aria-label="Settings">
            
            <SettingsIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="hover:opacity-80 transition-opacity"
            aria-label="Logout">
            
            <LogOutIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 md:px-6 py-4 md:py-6">
        {showBackToDashboard &&
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-[#2D2D2D] hover:text-[#D71E28] mb-4 transition-colors text-sm font-medium">
          
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
        }
        {title &&
        <h1 className="text-xl md:text-2xl font-bold text-[#2D2D2D] mb-4">
            {title}
          </h1>
        }
        {children}
      </div>

      {showNotifications &&
      <NotificationOverlay
        onClose={() => {
          setShowNotifications(false);
          fetchNotifCount();
        }} />

      }
    </div>);

}