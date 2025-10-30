'use client'
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import logo from "@/../public/logo.svg";
import { AlertCircle, Bell, BellRing, CheckCheck, CheckCircle, Info, LogOut, User, X } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useRouter } from 'next/navigation';
import { authAPI } from '../lib/authAPI';

const Header: FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications, currentUser } = useAppStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);
  
  // Close panels when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationsOpen(false);
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    router.push('/dashboard/settings');
  };

  const handleLogout = async () => {
    try {
      // Add your logout logic here
       await authAPI.logout();
      setIsUserMenuOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="flex fixed items-center justify-between w-full px-6 py-6 shadow-sm bg-white z-50">
      <Image src={logo} alt="Healthrive Logo" width={200} height={40} />

      <div className="flex items-center justify-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsUserMenuOpen(false);
            }}
            className="relative flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {unreadNotifications.length}
              </span>
            )}
          </button>
          
          {/* Notification Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <BellRing className="w-5 h-5" />
                  Notifications
                  {unreadNotifications.length > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                    <Bell className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-sm">No notifications yet</p>
                    <p className="text-xs">We&apos;ll notify you when something arrives</p>
                  </div>
                ) : (
                  <>
                    {/* Unread Notifications */}
                    {unreadNotifications.length > 0 && (
                      <div className="bg-blue-50 px-4 py-2">
                        <p className="text-xs font-medium text-blue-700">NEW</p>
                      </div>
                    )}
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={() => markNotificationAsRead(notification._id)}
                            className="text-gray-400 hover:text-gray-600 ml-2 cursor-pointer"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Read Notifications */}
                    {readNotifications.length > 0 && (
                      <>
                        <div className="bg-gray-50 px-4 py-2">
                          <p className="text-xs font-medium text-gray-700">EARLIER</p>
                        </div>
                        {readNotifications.map((notification) => (
                          <div
                            key={notification._id}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors opacity-75"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 opacity-50">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-600">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              
              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      notifications
                        .filter(n => !n.read)
                        .forEach(n => markNotificationAsRead(n._id));
                    }}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium py-2 text-center cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <div 
            onClick={handleUserMenuClick}
            className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 text-gray-600" />
            <h1 className="font-medium text-black text-lg">{currentUser?.name}</h1>
          </div>
          
          {/* User Dropdown Modal */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Profile</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;