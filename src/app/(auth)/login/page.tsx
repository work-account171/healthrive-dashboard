

"use client";
import logo from "@/../public/logo.svg";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; 
import Link from "next/link";
import Toaster from "@/app/components/Toaster";
import { useRouter } from "next/navigation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "warning";
  } | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", 
      });

      if (res.ok) {
        router.push("/dashboard"); 
      } else {
        const data = await res.json();
        setToast({ message: data.message, variant: "error" });
      }
    } catch (error) {
      setToast({ 
        message: "Network error. Please try again.", 
        variant: "error" 
      });
      console.error(error);
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  return (
    <>
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
            <Image src={logo} alt="logo" width="224" height="61" />
            <div className="flex flex-col gap-5 justify-center items-center">
              <h1 className="text-primary text-4xl font-semibold font-outfit">
                Welcome to Healthrive Dashboard
              </h1>
              <p className="text-center text-black text-lg">
                Sign in to manage your clinical tasks and workflows.
              </p>
            </div>
            <form
              onSubmit={loginHandler}
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
                  disabled={loading} // Disable inputs during loading
                />
              </div>
              <div className="flex flex-col gap-2 justify-center items-start w-full group">
                <label htmlFor="password" className="text-black">
                  Password
                </label>
                <div className="flex flex-row px-5 w-full focus-within:border-black focus-within:border-2 py-2.5 rounded-xl border border-[#d8dae5] justify-center items-center">
                  <input
                    type={showPassword ? "password" : "text"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    className="w-full placeholder:text-[rgba(3,6,7,0.6)] outline-none"
                    disabled={loading} // Disable inputs during loading
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-500 hover:text-black"
                    disabled={loading} // Disable button during loading
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <Link
                  href="/forget-password"
                  className="text-sm text-primary text-right w-full hover:underline"
                >
                  Forget Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading} // Disable button during loading
                className="cursor-pointer w-full bg-primary py-4 px-5 rounded-xl text-white text-[16px] hover:bg-transparent hover:text-primary border-pimary border disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;