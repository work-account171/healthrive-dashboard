// components/Navbar.tsx

import Image from 'next/image';
import { FC } from 'react';
import logo from "@/../public/logo.svg";
import { Bell, User } from 'lucide-react';


const Header: FC = () => {
  return (
    <nav className="flex fixed items-center justify-between w-full px-6 py-6 shadow-sm bg-white">

        <Image src={logo} alt="Healthrive Logo" width={200} height={40} />
        


      <div className="flex items-center justify-center gap-4 ">
            <div className="bg-gray-200 rounded-full p-2">
            <Bell/>
            </div>

 
        <div className="flex items-center justify-center gap-3">
          <User/>
          <h1 className=" font-medium text-black text-lg">Dr. Chioma</h1>
        </div>
      </div>
    </nav>
  );
};

export default Header;
