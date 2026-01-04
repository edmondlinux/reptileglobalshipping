"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and user is not admin, redirect to home
    if (!isLoading && (!user || user.role !== "admin")) {
      router.replace("/home"); // Changed from router.push to router.replace to avoid going back to admin dashboard
    } else if (user && user.role === "admin") {
      // If user is admin, set the URL to /admin-dashboard
      router.replace("/admin-dashboard");
    }
  }, [user, isLoading, router]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not admin or not logged in, return null (content will be handled by redirect)
  if (!user || user.role !== "admin") {
    return null;
  }

  // Render admin dashboard content
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-4">Welcome to Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">Hello, {user.name}!</p>
      </div>
    </div>
  );
}