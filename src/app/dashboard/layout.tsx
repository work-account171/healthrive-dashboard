import Header from "../components/Header";
import Sidebars from "../components/Sidebar";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex flex-col justify-start items-start">
      <Header />
      <div className="flex flex-row w-full pt-20 h-screen">
        <Sidebars />
        <main className="flex-1 px-6 pt-6">{children}</main>
      </div>
    </div>
  );
}

