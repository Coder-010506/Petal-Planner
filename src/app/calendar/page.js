"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarGrid from "@/components/CalendarGrid";
import YearlyView from "@/components/YearlyView";
import AgendaView from "@/components/AgendaView";
import NotesPanel from "@/components/NotesPanel";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ArrowLeft, Calendar as CalendarIcon, CalendarDays, List } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly', 'yearly', 'agenda'
  const [currentMonth, setCurrentMonth] = useState(new Date());


  return (
    <div className="min-h-screen w-full relative overflow-hidden paper-texture">
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/5 pointer-events-none" />

      <ThemeSwitcher />

      <div className="container mx-auto px-4 py-8 md:py-16 h-full min-h-screen flex flex-col relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex"
          >
            <Link href="/" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity font-sans font-medium hover:bg-[var(--theme-accent)]/20 p-2 rounded-lg">
              <ArrowLeft size={16} /> Back to Cover
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex p-1 rounded-2xl glass shadow-sm w-fit"
          >
            {[
              { id: 'monthly', icon: CalendarDays, label: 'Month' },
              { id: 'yearly', icon: CalendarIcon, label: 'Year' },
              { id: 'tasks', icon: List, label: 'Tasks' }
            ].map(view => {
              const active = viewMode === view.id;
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setViewMode(view.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors z-10 ${
                    active ? "text-[var(--theme-text)] font-semibold" : "text-[var(--theme-text)] opacity-60 hover:opacity-100 font-medium"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="view-highlight"
                      className="absolute inset-0 bg-white/60 shadow-sm rounded-xl -z-10 border border-white/40"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <Icon size={16} />
                  <span className="hidden sm:inline font-sans">{view.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto w-full items-start h-full">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 h-full w-full"
          >
            {viewMode === "monthly" && (
              <div className="glass rounded-[2.5rem] p-6 md:p-10 text-[var(--theme-text)] shadow-2xl border border-white/60 w-full">
                <CalendarGrid 
                  selectedDates={selectedDates} 
                  setSelectedDates={setSelectedDates} 
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                />
              </div>
            )}
            {viewMode === "yearly" && (
              <div className="glass rounded-[2.5rem] p-6 md:p-10 text-[var(--theme-text)] shadow-2xl border border-white/60 w-full h-[600px] overflow-y-auto custom-scrollbar">
                <YearlyView 
                  setViewMode={setViewMode} 
                  setSelectedDates={setSelectedDates} 
                  setCurrentMonth={setCurrentMonth}
                />
              </div>
            )}
            {viewMode === "tasks" && (
              <div className="w-full h-[600px]">
                <AgendaView />
              </div>
            )}
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
