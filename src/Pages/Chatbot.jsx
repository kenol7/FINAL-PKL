import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function ChatBot() {
  const robotRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [blink, setBlink] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleFeatureClick = (link) => {
    navigate(link);
  };

  const features = [
    { icon: "💬", title: "Chat Cerdas", desc: "AI untuk rekomendasi properti" },
    {
      icon: "🏠",
      title: "Cari Rumah",
      desc: "Filter otomatis sesuai budget",
      link: "/beli",
    },
    { icon: "📊", title: "Analisis KPR", desc: "Simulasi cicilan real-time", link: "/kpr" },
    { icon: "📍", title: "Jual Rumah", desc: "Bisa Jual Rumah juga loh",link: "/jualrumah" },
  ];

  // Eye tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const robot = robotRef.current;
      if (!robot) return;
      const rect = robot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - (centerY - rect.height * 0.08);
      const angle = Math.atan2(dy, dx);
      const maxOffset = Math.min(rect.width, 200) * 0.06;

      const offsetX = Math.cos(angle) * maxOffset;
      const offsetY = Math.sin(angle) * maxOffset;

      [leftPupilRef.current, rightPupilRef.current].forEach((el) => {
        if (el) el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blink effect
  useEffect(() => {
    const blinkNow = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) blinkNow();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br  from-slate-50 via-blue-50 to-purple-50 text-slate-800 px-6 py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-pink-200/30 to-orange-200/30 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "5%" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-300/30 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "10%", right: "5%" }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200/20 to-amber-200/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "50%", right: "20%" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-sky-400/40 rounded-full"
          animate={{
            y: [0, -800],
            x: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
          }}
          style={{
            left: `${10 + i * 15}%`,
            bottom: 0,
          }}
        />
      ))}

      <div className="relative my-8 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl w-full z-10">
        {/* Left Side - Robot */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            ref={robotRef}
            className="relative flex flex-col items-center select-none"
            initial={{ y: 0 }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Robot Head */}
            <div className="relative w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl shadow-2xl flex items-center justify-center">
              {/* Antennas */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                <motion.div
                  animate={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-8 bg-slate-600 rounded-full relative"
                >
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-8 bg-slate-600 rounded-full relative"
                >
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </motion.div>
              </div>

              {/* Ears */}
              <motion.div
                className="absolute -left-8 top-1/2 -translate-y-1/2 w-12 h-16 bg-orange-400 rounded-full"
                animate={{ scaleY: hovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-16 bg-orange-400 rounded-full"
                animate={{ scaleY: hovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Eyes container */}
              <div className="flex gap-12 mb-8">
                {/* Left Eye */}
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <div
                    ref={leftPupilRef}
                    className={`w-7 h-7 bg-slate-800 rounded-full transition-all duration-75 ${
                      hovered
                        ? "shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-110"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full ml-1 mt-1" />
                  </div>
                </div>

                {/* Right Eye */}
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <div
                    ref={rightPupilRef}
                    className={`w-7 h-7 bg-slate-800 rounded-full transition-all duration-75 ${
                      hovered
                        ? "shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-110"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full ml-1 mt-1" />
                  </div>
                </div>
              </div>

              {/* Blink overlay */}
              <div
                className="absolute flex gap-12 mb-8 pointer-events-none"
                style={{
                  opacity: blink ? 1 : 0,
                  transition: "opacity 120ms linear",
                }}
              >
                <div className="w-14 h-7 bg-cyan-600 rounded-full" />
                <div className="w-14 h-7 bg-cyan-600 rounded-full" />
              </div>

              {/* Smile */}
              <motion.div
                className="absolute bottom-16 w-24 h-12 border-b-4 border-slate-700 rounded-b-full"
                animate={{ scaleX: hovered ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Decorative lights */}
              <div className="absolute bottom-4 flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-yellow-300 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Shadow */}
            <motion.div
              className="mt-4 w-64 h-8 bg-slate-400/30 rounded-full blur-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

          {/* Speech Bubble */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute -top-24 left-1/2 z-20 -translate-x-1/2 bg-white rounded-2xl px-6 py-3 shadow-xl border-2 border-blue-200"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ⚙️
                </motion.div>
                <div className="text-left">
                  <div className="font-bold text-slate-800">
                    Sedang Dibangun
                  </div>
                  <div className="text-xs text-slate-500">
                    Akan segera hadir! ✨
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-blue-200 transform rotate-45" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right Side - Content */}
        <motion.div
          className="flex-1 max-w-xl text-center lg:text-left"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              🚧 Under Development
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
              Chatbot AI Sedang Dibangun
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Kami sedang mengembangkan asisten pintar berbasis AI untuk
              membantu Anda menemukan properti impian dengan lebih mudah dan
              cepat.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  activeTab === index
                    ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-lg scale-105"
                    : "bg-white border-slate-200 hover:border-blue-200"
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setActiveTab(index);
                  if (feature.link) handleFeatureClick(feature.link);
                }}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-semibold text-slate-800">
                  {feature.title}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {feature.desc}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/beli")}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
            >
              <span>🏠</span>
              Jelajahi Properti
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-8 py-4 rounded-full border-2 border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>🏡</span>
              Kembali ke Beranda
            </motion.button>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mt-8 p-4 bg-white rounded-xl shadow-md border border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 font-medium">
                Progress Pengembangan
              </span>
              <span className="text-blue-600 font-bold">75%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, delay: 1 }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Estimasi peluncuran: Q2 2025 🚀
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer Note */}
      <motion.p
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        ℹ️ Ini bukan halaman error — fitur sedang dalam tahap pengembangan aktif
      </motion.p>
    </section>
  );
}
