'use client'
import Image from 'next/image';
import { FC } from 'react';
import logo from "@/../public/logo.svg";
import { Bell, LogOut, User } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { authAPI } from '../lib/authAPI';


const Header: FC = () => {
  const {notifications,currentUser}=useAppStore();
    const unreadNotifications = notifications.filter(n => !n.read)
    console.log(currentUser)
    const handleLogout = async () => {
    await authAPI.logout()
    // You might want to redirect to login page here
  }
  

  return (
    <nav className="flex fixed items-center justify-between w-full px-6 py-6 shadow-sm bg-white">

        <Image src={logo} alt="Healthrive Logo" width={200} height={40} />
        


      <div className="flex items-center justify-center gap-4 ">
            <div className="bg-gray-200 relative rounded-full p-2">
            <Bell />
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadNotifications.length}
            </span>
          )}
            </div>

 
        <div className="flex items-center justify-center gap-3">
          <User/>
          <h1 className=" font-medium text-black text-lg">{currentUser?.name}</h1>
        </div>
        
      </div>
    </nav>
  );
};

export default Header;
