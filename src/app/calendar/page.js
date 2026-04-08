"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CalendarGrid from "@/components/CalendarGrid";
import NotesPanel from "@/components/NotesPanel";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const [selectedDates, setSelectedDates] = useState([]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden paper-texture">
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/5 pointer-events-none" />

      <ThemeSwitcher />

      <div className="container mx-auto px-4 py-8 md:py-16 h-full min-h-screen flex flex-col relative z-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 inline-flex"
        >
          <Link href="/" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity font-sans font-medium hover:bg-[var(--theme-accent)]/20 p-2 rounded-lg">
            <ArrowLeft size={16} /> Back to Cover
          </Link>
        </motion.div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto w-full items-start">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 glass rounded-[2.5rem] p-6 md:p-10 text-[var(--theme-text)] shadow-2xl border border-white/60"
          >
            <CalendarGrid selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 h-[600px] lg:h-full lg:min-h-[500px]"
          >
            <NotesPanel selectedDates={selectedDates} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
