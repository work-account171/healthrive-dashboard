// app/dashboard/layout.tsx
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-screen">
      {/* Sidebar */}
      <aside className="bg-red-400 w-[15%] p-4">
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard/tasks">Tasks</Link>
          <Link href="/dashboard/patients">Patients</Link>
          <Link href="/dashboard/social-links">Social Links</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
