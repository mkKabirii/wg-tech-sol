"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/zustand/authStore";

export default function Dashboard() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/wgAuthForm");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearAuth();
    router.push("/wgAuthForm");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#9EFF00]">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user?.fullname || "User"} 👋</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Profile Card */}
          <Link href="/dashboard/profile">
            <div className="border border-[#333] rounded-xl p-6 hover:border-[#9EFF00] transition-all cursor-pointer bg-[#111]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#9EFF00] flex items-center justify-center text-black text-2xl font-bold">
                  {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.fullname}</h2>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>
              <p className="text-[#9EFF00] text-sm font-medium">Edit Profile →</p>
            </div>
          </Link>

          {/* Proposals Card */}
          <div className="border border-[#333] rounded-xl p-6 bg-[#111]">
            <h2 className="text-xl font-semibold mb-2">My Proposals</h2>
            <p className="text-gray-400 text-sm">View your submitted proposals and their status.</p>
            <p className="text-[#9EFF00] text-sm font-medium mt-4">Coming Soon →</p>
          </div>

        </div>

        {/* Logout */}
        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}