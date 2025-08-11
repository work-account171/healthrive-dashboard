'use client'
import logo from "@/../public/logo.svg";
import Image from "next/image";
import { useState } from "react";
function login() {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
  return (
    <>
        <section className="flex justify-center items-center">
            <div className="flex flex-col justify-center items-center w-2/3 mx-auto">
        <div className="flex flex-col justify-center items-center gap-10">
          <Image src={logo} alt="logo" width="224" height="61" />
          <div className="flex flex-col gap-5 justify-center items-center">
            <h1 className="text-primary text-4xl   font-semibold ">
              Welcome to Healthrive Dashboard
            </h1>
            <p className="text-center text-black text-lg">
              Sign in to manage your clinical tasks and workflows.
            </p>
          </div>
          <form action="" className="bg-white border-xl  w-full border border-[#d8dae5] rounded-xl shadow-lg p-4 max-w-[560px]">
            <div className="flex flex-col gap-2 justify-center items-start w-full">
            <label htmlFor="email" className="text-black">Email Address</label>
            <input type="email" placeholder="Enter your email address" value={email} name="email" className="px-5 w-full text-[rgba(3,6,7,0.6)] py-2.5 rounded-xl border border-[#d8dae5]" />
            </div>
          </form>
        </div>
      </div>
        </section>
      
    </>
  );
}

export default login;
