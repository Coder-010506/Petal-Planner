"use client";

import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Palette, X } from "lucide-react";

const themes = [
  { id: "blossom", name: "🌸 Blossom", color: "#fdf2f8" },
  { id: "dreamy", name: "☁️ Dreamy Sky", color: "#f0f9ff" },
  { id: "peach", name: "🍑 Peach Pastel", color: "#fff7ed" },
  { id: "night", name: "🌙 Night Aesthetic", color: "#1e1b4b" },
  { id: "study", name: "📖 Study Journal", color: "#f5f5f4" },
];

export default function ThemeSwitcher() {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full glass shadow-lg flex items-center justify-center text-current hover:bg-white/20 transition-colors"
      >
        <Palette size={24} className="opacity-80" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-16 right-0 glass shadow-2xl rounded-2xl p-4 w-60 border border-white/50"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/10">
              <h3 className="font-sans font-semibold text-lg opacity-80">Aesthetics</h3>
              <button onClick={() => setIsOpen(false)} className="opacity-50 hover:opacity-100">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    changeTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    theme === t.id ? "bg-white/40 shadow-inner translate-x-1" : "hover:bg-white/20"
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full shadow-sm border border-black/5"
                    style={{ backgroundColor: t.color }}
                  ></span>
                  <span className="font-sans font-medium text-sm opacity-80">{t.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
