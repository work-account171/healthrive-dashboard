'use client'

import React from 'react'
import { useState } from 'react';
import SettingsTabs from './SettingsTabs'
import Notifications from './Notifications';
import AccountSecurity from './AccountSecurity';
import UserRolesAccess from './UserRolesAccess';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <UserRolesAccess/>;
      case 1:
        return <Notifications />;
      case 2:
        return <AccountSecurity />;
      default:
        return null;
    }
  };
  return (
    <div>
        <div className='flex flex-col gap-[16px] '>
            <div className='text-3xl font-outfit font-semibold'>Settings</div>
            <div className='text-[16px] font-outfit'>Configure user roles, notification rules, integrations, and system preferences
                 to manage your clinic dashboard efficiently.</div>
        </div>
         <div className='flex flex-row pt-[24px] gap-[20px]'>
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
         <div className="flex-1">{renderContent()}</div>
         </div>
    </div>
  )
}

export default UserSettings