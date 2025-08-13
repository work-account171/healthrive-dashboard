// app/dashboard/layout.tsx
import Header from "../components/Header";
import Sidebars from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-start items-start ">
      <Header />
      <div className="flex flex-row w-full h-screen">
        <Sidebars />

        {/* Main content */}
        <main className="flex-1 px-6 pt-6">{children}</main>
      </div>
    </div>
  );
}
