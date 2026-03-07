"use client";
import { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { registerUser, loginUser } from "@/api/module/auth";
import { useAuthStore } from "@/zustand/authStore";

export default function AuthForm() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuthStore();

  const validateForm = (): boolean => {
    if (!fullname.trim() || fullname.trim().length < 3) {
      toast.error("Full name must be at least 3 characters");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
  //   setIsSubmitting(true);

  //   try {
  //     const loginRes = await loginUser({ email: email.trim(), password });
  //     if (loginRes.status === 200 || loginRes.status === 201) {
  //       setAuth(loginRes.data.data);
  //       toast.success("Logged in successfully!");
  //     }
  //   } catch (loginErr: any) {
  //     if (loginErr?.response?.status === 404) {
  //       try {
  //         const registerRes = await registerUser({
  //           fullname: fullname.trim(),
  //           email: email.trim(),
  //           password,
  //         });
  //         if (registerRes.status === 200 || registerRes.status === 201) {
  //           setAuth(registerRes.data.data);
  //           toast.success("Account created successfully!");
  //         } else {
  //           toast.error(registerRes.data?.message || "Registration failed");
  //         }
  //       } catch (regErr: any) {
  //         toast.error(regErr?.response?.data?.message || "Registration error");
  //       }
  //     } else {
  //       toast.error(loginErr?.response?.data?.message || "Login failed");
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    // Pehle login try karo
    const loginRes = await loginUser({ email: email.trim(), password });

    // ✅ Login success
    if (loginRes.status === 200 || loginRes.status === 201) {
      setAuth(loginRes.data.data);

      // token save karo
      localStorage.setItem("token", loginRes.data.data.token);

      toast.success("Welcome back!");

      // dashboard redirect
      window.location.href = "/dashboard";
      return;
    }

    // ✅ Login failed → 404 check
    if (loginRes.status === 404) {
      const registerRes = await registerUser({
        fullname: fullname.trim(),
        email: email.trim(),
        password,
      });

      // Register success
      if (registerRes.status === 200 || registerRes.status === 201) {
        setAuth(registerRes.data.data);

        // token save
        localStorage.setItem("token", registerRes.data.data.token);

        toast.success("Account created!");

        // dashboard redirect
        window.location.href = "/dashboard";
      } else {
        toast.error(registerRes.data?.message || "Registration failed");
      }
      return;
    }

    toast.error(loginRes.data?.message || "Login failed");
  } catch (error: any) {
    toast.error(error?.message || "Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[700px] border border-[#454545] p-8 space-y-6 rounded-lg"
      >
        {/* Full Name */}
        <div className="bg-[#232323] rounded-lg p-6">
          <label className="block text-white text-lg mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Type here"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            minLength={3}
            maxLength={120}
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500"
          />
        </div>

        {/* Email */}
        <div className="bg-[#232323] rounded-lg p-6">
          <label className="block text-white text-lg mb-2">Email</label>
          <input
            type="email"
            placeholder="Type here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500"
          />
        </div>

        {/* Password */}
        <div className="bg-[#232323] rounded-lg p-6">
          <label className="block text-white text-lg mb-2">Password</label>
          <input
            type="password"
            placeholder="Type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative block mx-auto w-full sm:w-auto overflow-hidden rounded-2xl border border-gray-500 bg-transparent text-2xl text-white cursor-pointer transition-colors duration-300 hover:text-black hover:border-[#9eff00] before:absolute before:inset-y-0 before:left-0 before:w-0 before:bg-[#9eff00] before:content-[''] before:transition-all before:duration-300 before:ease-out hover:before:w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 px-16 py-2">
              {isSubmitting ? "Please wait..." : "Continue"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
