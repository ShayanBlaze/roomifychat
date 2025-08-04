// src/components/UI/Hero.jsx

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// کامپوننت برای هر آیکون شناور (بدون تغییر)
const FloatingIcon = ({ children, position, animation }) => (
  <motion.div
    className="absolute"
    style={{ ...position }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1, ...animation.animate }}
    transition={{
      opacity: { duration: 0.5, delay: Math.random() * 1.5 },
      scale: { duration: 0.5, delay: Math.random() * 1.5 },
      ...animation.transition,
    }}
  >
    {children}
  </motion.div>
);

// --- مجموعه آیکون‌های SVG حرفه‌ای ---
const PaperPlaneIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    ></path>
  </svg>
);
const AtSymbolIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
    ></path>
  </svg>
);
const ChatBubbleIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    ></path>
  </svg>
);

// --- بازنویسی کامل HeroIllustration با آیکون‌های حرفه‌ای ---
const HeroIllustration = () => {
  const icons = [
    {
      icon: <PaperPlaneIcon className="w-8 h-8 text-cyan-300" />,
      position: { top: "15%", left: "10%" },
      animation: {
        animate: { y: [0, -20, 0] },
        transition: { y: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
      },
    },
    {
      icon: <AtSymbolIcon className="w-8 h-8 text-purple-300" />,
      position: { top: "25%", right: "15%" },
      animation: {
        animate: { y: [0, 15, 0] },
        transition: {
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
        },
      },
    },
    {
      icon: <ChatBubbleIcon className="w-8 h-8 text-gray-300" />,
      position: { bottom: "20%", left: "25%" },
      animation: {
        animate: { y: [0, -15, 0] },
        transition: {
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        },
      },
    },
    {
      icon: <span className="text-3xl">👍</span>, // ایموجی می‌تواند در کنار آیکون‌ها باشد
      position: { bottom: "15%", right: "10%" },
      animation: {
        animate: { y: [0, 20, 0] },
        transition: { y: { duration: 7, repeat: Infinity, ease: "easeInOut" } },
      },
    },
  ];

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      {/* پس‌زمینه‌های مات و نرم برای ایجاد عمق */}
      <motion.div
        className="absolute w-56 h-56 md:w-80 md:h-80 bg-cyan-500/5 rounded-full filter blur-2xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-48 h-48 md:w-64 md:h-64 bg-purple-500/5 rounded-full filter blur-2xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* رندر کردن آیکون‌های شناور در کپسول‌های شیشه‌ای */}
      {icons.map((item, index) => (
        <FloatingIcon
          key={index}
          position={item.position}
          animation={item.animation}
        >
          <div className="p-3 md:p-4 bg-gray-500/10 rounded-2xl backdrop-blur-sm border border-white/5 shadow-lg">
            {item.icon}
          </div>
        </FloatingIcon>
      ))}
    </div>
  );
};

// بقیه کامپوننت Hero (بدون تغییر)
const Hero = () => {
  return (
    <section className="flex-grow flex items-center relative z-10">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.h1
              className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              Seamless Conversations,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Perfectly Connected.
              </span>
            </motion.h1>
            <motion.p
              className="max-w-lg mx-auto lg:mx-0 mt-6 text-lg text-gray-400"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.1 },
                },
              }}
            >
              Welcome to RoomifyChat. The simple, fast, and secure way to
              communicate with your friends and teams in real-time.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 },
                },
              }}
            >
              <Link
                to="/register"
                className="relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                Get Started for Free
              </Link>
              <Link
                to="/login"
                className="font-semibold text-gray-300 hover:text-white transition-colors"
              >
                I have an account
              </Link>
            </motion.div>
          </motion.div>
          <div className="w-full h-full hidden lg:flex">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
