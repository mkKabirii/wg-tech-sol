"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/authStore";
import { getProfile, updateProfile, updateProfilePicture } from "@/api/module/user";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/wgAuthForm"); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      if (res.status === 200 || res.status === 201) {
        const data = res.data?.data || res.data;
        setFormData({
          fullname: data.fullname || "",
          email: data.email || "",
          password: "",
          confirmPassword: "",
        });
        setProfilePic(data.profilePicture || null);
      }
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      const payload: any = {
        fullname: formData.fullname,
        email: formData.email,
      };
      if (formData.password) payload.password = formData.password;

      const res = await updateProfile(payload);
      if (res.status === 200 || res.status === 201) {
        const data = res.data?.data || res.data;
        setAuth({ token: localStorage.getItem("token")!, user: data.user || data });
        toast.success("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("profilePicture", file);

    try {
      const res = await updateProfilePicture(formDataObj);
      if (res.status === 200 || res.status === 201) {
        const data = res.data?.data || res.data;
        setProfilePic(data.profilePicture);
        toast.success("Profile picture updated!");
      } else {
        toast.error("Picture upload failed");
      }
    } catch (err) {
      toast.error("Upload error");
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#9EFF00] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link href="/dashboard" className="text-gray-400 hover:text-[#9EFF00] text-sm mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-[#9EFF00] mb-8">Edit Profile</h1>

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <div
            className="w-24 h-24 rounded-full border-2 border-[#9EFF00] overflow-hidden cursor-pointer flex items-center justify-center bg-[#1a1a1a]"
            onClick={() => fileInputRef.current?.click()}
          >
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-[#9EFF00]">
                {formData.fullname?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="border border-[#9EFF00] text-[#9EFF00] px-4 py-2 rounded-lg text-sm hover:bg-[#9EFF00] hover:text-black transition-all"
            >
              Change Photo
            </button>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG — Max 2MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePictureChange}
          />
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Full Name */}
          <div className="bg-[#111] border border-[#333] rounded-xl p-5">
            <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full bg-transparent text-white outline-none text-lg placeholder-gray-600"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div className="bg-[#111] border border-[#333] rounded-xl p-5">
            <label className="text-gray-400 text-sm mb-2 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent text-white outline-none text-lg placeholder-gray-600"
              placeholder="your@email.com"
            />
          </div>

          {/* New Password */}
          <div className="bg-[#111] border border-[#333] rounded-xl p-5">
            <label className="text-gray-400 text-sm mb-2 block">New Password <span className="text-gray-600">(leave blank to keep current)</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent text-white outline-none text-lg placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div className="bg-[#111] border border-[#333] rounded-xl p-5">
            <label className="text-gray-400 text-sm mb-2 block">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-transparent text-white outline-none text-lg placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-4 bg-[#9EFF00] text-black font-bold text-lg rounded-xl hover:bg-[#8CE600] transition-all disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}