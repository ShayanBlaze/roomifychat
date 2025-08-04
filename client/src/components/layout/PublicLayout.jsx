// src/components/layout/PublicLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import PublicHeader from "../UI/PublicHeader"; // هدر جدید را ایمپورت کنید

// پس‌زمینه انیمیشنی که در صفحه اصلی بود
const AnimatedBackground = () => (
  <motion.div
    className="fixed inset-0 -z-10 w-full h-full"
    style={{
      backgroundImage: "linear-gradient(135deg, #111827, #1a202c, #2d3748)",
      backgroundSize: "200% 200%",
    }}
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
  />
);

const PublicLayout = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col relative overflow-x-hidden">
      <AnimatedBackground />
      <PublicHeader />
      <main className="flex-grow flex flex-col">
        <Outlet /> {/* صفحات عمومی در اینجا رندر می‌شوند */}
      </main>
    </div>
  );
};

export default PublicLayout;
