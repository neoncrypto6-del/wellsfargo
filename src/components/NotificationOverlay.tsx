import React, { useEffect, useState } from 'react';
import { XIcon, BellIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
interface NotificationOverlayProps {
  onClose: () => void;
}
export function NotificationOverlay({
  onClose
}: NotificationOverlayProps) {
  const {
    user
  } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchNotifications();
    const channel = supabase.channel('notif-realtime').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user?.id}`
    }, (payload) => {
      setNotifications((prev) => [payload.new as Notification, ...prev]);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  async function fetchNotifications() {
    if (!user) return;
    setLoading(true);
    const {
      data
    } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', {
      ascending: false
    });
    setNotifications(data || []);
    setLoading(false);
    // Mark unread as read
    await supabase.from('notifications').update({
      is_read: true
    }).eq('user_id', user.id).eq('is_read', false);
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BellIcon className="w-5 h-5 text-[#D71E28]" />
            <h2 className="text-xl font-bold text-[#2D2D2D]">Notifications</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
            </div> : notifications.length === 0 ? <div className="text-center py-12 text-gray-500">
              <BellIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
            </div> : <div className="space-y-4">
              {notifications.map((n) => <div key={n.id} className={`p-4 rounded-lg border ${!n.is_read ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                  <h3 className="font-semibold text-[#2D2D2D] mb-1">
                    {n.title}
                  </h3>
                  <p className="text-sm text-[#666]">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
}