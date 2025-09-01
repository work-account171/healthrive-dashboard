'use client'
import Link from "next/link"
import taskIcon from "@/../public/icons/task-manager.svg"
import dashboardIcon from "@/../public/icons/dashboard.svg"
import settingIcon from "@/../public/icons/settings.svg"
import calenderIcon from "@/../public/icons/calender.svg"
import patientIcon from "@/../public/icons/patient.svg"
import LinkIcon from "@/../public/icons/link.svg"
import Image from "next/image"
import { LogOutIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
function Sidebars() {
  const pathname=usePathname();
  const router=useRouter()
  const links=[
    {
      href:"/dashboard",label:"Dashboard",icon:dashboardIcon
    },
    { href: "/dashboard/task-manager", label: "Task Manager", icon: taskIcon },
    { href: "/dashboard/patient-manager", label: "Patient Management", icon: patientIcon },
    { href: "/dashboard/linked-tools", label: "Linked Tools", icon: LinkIcon },
    { href: "/dashboard/calender", label: "Calender", icon: calenderIcon },
    { href: "/dashboard/settings", label: "Setting", icon: settingIcon },
  ]
  const handleLogout=async()=>{
    try {
      await fetch("/api/auth/logout",{
        method:"POST",
        credentials:"include"
      })
      router.push("/login")
    } catch (error) {
      console.error("logout failed"+error)
    }

  }
  return (
    <>
    <aside className="w-fit  p-6 flex flex-col items-center justify-between border-primary border-r">
        <nav className="flex flex-col gap-5">
            {links.map(({href,label,icon})=>{
              const isActive=pathname===href;
              return(
                    <Link
              key={href}
              href={href}
              className={`flex justify-start items-center gap-2.5 py-3 px-4 rounded-xl text-[16px] font-semibold 
                ${isActive ? "bg-primary text-white" : "text-black hover:bg-gray-100"}`}
            >
              <Image
                src={icon}
                alt={`${label} icon`}
                width={30}
                height={30}
                className={`${isActive ? "brightness-0 invert" : ""}`} // makes icon white
              />
              {label}
            </Link>
              )
            })}
            
           
         
        </nav>
        <button onClick={handleLogout} className="bg-gray-200 py-3 gap-2.5 text-[16px] font-bold hover:bg-red-600 hover:text-white px-4 flex justify-start items-center w-full rounded-xl">
          <LogOutIcon/>
          Logout
          </button>
      </aside>
    </>
  )
}

export default Sidebars