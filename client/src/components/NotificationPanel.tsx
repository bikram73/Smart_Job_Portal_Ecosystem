import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationsAPI } from '@/services/api';
import { X, Bell, CheckCheck } from 'lucide-react';
import { Notification } from '@/types';

interface Props {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: Props) {
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery('notifications', () =>
    notificationsAPI.getNotifications().then(res => res.data)
  );

  const markAsReadMutation = useMutation(
    (id: string) => notificationsAPI.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  const markAllAsReadMutation = useMutation(
    () => notificationsAPI.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  const unreadCount = notifications?.filter((n: Notification) => !n.read).length || 0;

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-gray-200 shadow-xl z-40 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} />
          <h2 className="font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bell size={48} className="mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications?.map((notification: Notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => !notification.read && markAsReadMutation.mutate(notification._id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    !notification.read ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
