// "use client"
// import Toaster from '@/app/components/Toaster';
// import { Eye, EyeOff, Loader2Icon } from 'lucide-react';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation'
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'

// function ResetPassword() {
//   const searchParams=useSearchParams()
//   const token=searchParams.get("token");
//     const router=useRouter();
//   const [toast,setToast]=useState<{message:string,variant:"success"|"error"|"warning"}|null>(null);
//   const [showConfirmPassword,setShowConfirmPassword]=useState(false);
//   const [showPassword,setShowPassword]=useState(false)
//   const [password,setPassword]=useState("")
//   const [confirmPassword,setConfirmPassword]=useState("")
//   const [loading,setLoading]=useState(false)
//     useEffect(()=>{
//         if(!token){
//             setToast({message:"invalid reset link",variant:"error"})
//             router.push("/forget-password")
//         }
//     },[token,router])
//   async function handleResetPassword(e:React.FormEvent<HTMLFormElement>){
//         e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setToast({ message: "Passwords do not match", variant: "error" });
//       return;
//     }
    
//     if (password.length < 6) {
//       setToast({ 
//         message: "Password must be at least 6 characters", 
//         variant: "error" 
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`,
//         {
//           method: "POST",
//           headers: { "Content-type": "application/json" },
//           body: JSON.stringify({ token, password }),
//         }
//       );
      
//       const data = await res.json();
      
//       if (res.ok) {
//         setToast({ 
//           message: "Password reset successfully! Redirecting to login...", 
//           variant: "success" 
//         });
//         setTimeout(() => {
//           router.push("/login");
//         }, 2000);
//       } else {
//         setToast({ message: data.message, variant: "error" });
//       }
//     } catch (error) {
//       setToast({ message: "Network error, please try again!", variant: "error" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (

//     <section className="flex justify-center h-screen items-center bg-[url('/login-bg.svg')] bg-center bg-cover">
//       {toast && (
//         <Toaster
//           message={toast.message}
//           variant={toast.variant}
//           onClose={() => setToast(null)}
//         />
//       )}
//       <div className="flex flex-col justify-center items-center w-2/3 bg-red-400 mx-auto">
//         <div className="flex flex-col justify-center items-center gap-10 w-full">
//           <div className="flex flex-col gap-5 justify-center items-center">
//             <h1 className="text-primary text-4xl font-semibold font-outfit">
//               Reset Password
//             </h1>
//             <p className="text-center text-black text-lg">
//               Enter your new password below.
//             </p>
//           </div>
//           <form
//             className="bg-white border-xl flex flex-col gap-6 w-full border border-[#d8dae5] rounded-xl shadow-lg p-4 max-w-[560px]"
//             onSubmit={handleResetPassword}
//           >
//             <div className="flex flex-col gap-2 justify-center items-start w-full">
//               <label htmlFor="password" className="text-black">
//                 New Password
//               </label>
//               <div className="relative w-full">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter new password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   name="password"
//                   className="px-5 w-full placeholder:text-[rgba(3,6,7,0.6)] text-black py-2.5 rounded-xl border border-[#d8dae5]"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3 text-gray-500"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2 justify-center items-start w-full">
//               <label htmlFor="confirmPassword" className="text-black">
//                 Confirm Password
//               </label>
//               <div className="relative w-full">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   name="confirmPassword"
//                   className="px-5 w-full placeholder:text-[rgba(3,6,7,0.6)] text-black py-2.5 rounded-xl border border-[#d8dae5]"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-3 text-gray-500"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-primary py-4 px-5 rounded-xl text-white text-[16px] hover:bg-transparent hover:text-primary border-primary border disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <Loader2Icon className="animate-spin inline mr-2" />
//                   Resetting Password...
//                 </>
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
            
//             <Link
//               href="/login"
//               className="text-sm text-primary text-center hover:underline"
//             >
//               Back to Login
//             </Link>
//           </form>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ResetPassword




"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toaster from "@/app/components/Toaster";
import { Loader2Icon, Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  useEffect(() => {
    // Extract token from URL on client side
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    setToken(tokenParam);
    
    if (!tokenParam) {
      setToast({ message: "Invalid reset link", variant: "error" });
      router.push("/forget-password");
    }
  }, [router]);

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!token) return;
    
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match", variant: "error" });
      return;
    }
    
    if (password.length < 6) {
      setToast({ 
        message: "Password must be at least 6 characters", 
        variant: "error" 
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );
      
      const data = await res.json();
      
      if (res.ok) {
        setToast({ 
          message: "Password reset successfully! Redirecting to login...", 
          variant: "success" 
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setToast({ message: data.message, variant: "error" });
      }
    } catch (error) {
      setToast({ message: "Network error, please try again!", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex justify-center h-screen items-center bg-[url('/login-bg.svg')] bg-center bg-cover">
      {toast && (
        <Toaster
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col justify-center items-center w-2/3 mx-auto">
        <div className="flex flex-col justify-center items-center gap-10">
          <div className="flex flex-col gap-5 justify-center items-center">
            <h1 className="text-primary text-4xl font-semibold font-outfit">
              Reset Password
            </h1>
            <p className="text-center text-black text-lg">
              Enter your new password below.
            </p>
          </div>
          <form
            className="bg-white border-xl flex flex-col gap-6 w-full border border-[#d8dae5] rounded-xl shadow-lg p-4 max-w-[560px]"
            onSubmit={handleResetPassword}
          >
            {/* ... rest of the form remains the same */}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;