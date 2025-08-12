"use client";
import logo from "@/../public/logo.svg";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <section className="flex justify-cente h-screen items-center bg-[url('/login-bg.svg')] bg-center bg-cover">
      <div className="flex flex-col justify-center items-center w-2/3 mx-auto">
        <div className="flex flex-col justify-center items-center gap-10">
          <Image src={logo} alt="logo" width="224" height="61" />
          <div className="flex flex-col gap-5 justify-center items-center">
            <h1 className="text-primary text-4xl font-semibold font-outfit">
              Forget Password
            </h1>
            <p className="text-center text-black text-lg">
              Sign in to manage your clinical tasks and workflows.
            </p>
          </div>
          <form
            className="bg-white border-xl flex flex-col gap-6 w-full border border-[#d8dae5] rounded-xl shadow-lg p-4 max-w-[560px]"
          >
            <div className="flex flex-col gap-2 justify-center items-start w-full">
              <label htmlFor="email" className="text-black">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                className="px-5 w-full placeholder:text-[rgba(3,6,7,0.6)] text-black py-2.5 rounded-xl border border-[#d8dae5]"
              />
              <Link
                href="/forget-password"
                className="text-sm text-primary text-right w-full hover:underline"
                onClick={() => router.back()}
              >
                Back to Login
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-primary py-4 px-5 rounded-xl text-white text-[16px] hover:bg-transparent hover:text-primary border-primary border"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ForgetPassword;
