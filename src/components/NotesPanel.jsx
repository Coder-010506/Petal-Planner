"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Trash2, Edit3 } from "lucide-react";

const MOODS = [
  { emoji: "😊", glow: "rgba(251, 191, 36, 0.6)" },
  { emoji: "💖", glow: "rgba(244, 114, 182, 0.6)" },
  { emoji: "🌧", glow: "rgba(148, 163, 184, 0.6)" },
  { emoji: "😴", glow: "rgba(129, 140, 248, 0.6)" },
  { emoji: "✨", glow: "rgba(192, 132, 252, 0.6)" },
];

export default function NotesPanel({ selectedDates }) {
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [mood, setMood] = useState(null);
  
  const isSingleDate = selectedDates.length === 1;
  const dateKey = selectedDates.length === 0 
    ? null 
    : isSingleDate 
      ? selectedDates[0] 
      : `${selectedDates[0]}_${selectedDates[selectedDates.length - 1]}`;

  useEffect(() => {
    if (!dateKey) return;
    
    // Load Note
    const stored = localStorage.getItem(`petal-notes-${dateKey}`);
    if (stored) {
      setNote(stored);
      setIsEditing(false);
    } else {
      setNote("");
      setIsEditing(true);
    }

    // Load Mood
    if (isSingleDate) {
      try {
        const storedMood = localStorage.getItem(`petal-mood-${dateKey}`);
        if (storedMood) setMood(JSON.parse(storedMood));
        else setMood(null);
      } catch(e) { setMood(null); }
    } else {
      setMood(null);
    }
  }, [dateKey, isSingleDate]);

  const saveNote = () => {
    if (note.trim() === "") {
      localStorage.removeItem(`petal-notes-${dateKey}`);
    } else {
      localStorage.setItem(`petal-notes-${dateKey}`, note);
    }
    setIsEditing(false);
  };

  const deleteNote = () => {
    localStorage.removeItem(`petal-notes-${dateKey}`);
    setNote("");
    setIsEditing(true);
  };

  const updateMood = (m) => {
    const isRemoving = mood?.emoji === m.emoji;
    const newMood = isRemoving ? null : m;
    
    setMood(newMood);
    
    if (newMood) {
      localStorage.setItem(`petal-mood-${dateKey}`, JSON.stringify(newMood));
    } else {
      localStorage.removeItem(`petal-mood-${dateKey}`);
    }

    // Safely emit to grid without causing loop
    window.dispatchEvent(new CustomEvent('petal-mood-updated', {
      detail: { date: dateKey, mood: newMood }
    }));
  };

  if (!dateKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-60 p-8">
        <span className="text-4xl mb-4 opacity-50">📖</span>
        <p className="font-cursive text-3xl">Select a date to write...</p>
      </div>
    );
  }

  const dateLabel = isSingleDate 
    ? new Date(selectedDates[0]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : `${new Date(selectedDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(selectedDates[selectedDates.length-1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {/* Authentic Sticky Note Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -15, y: 50 }}
        animate={{ opacity: 1, scale: 1, rotate: 2, y: 0 }}
        key={dateKey}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-full max-w-md h-[550px] flex flex-col relative shadow-[2px_15px_40px_rgba(0,0,0,0.15)] bg-[#fff9c4] rounded-sm transform-gpu p-8 pb-10"
        style={{
          boxShadow: `
            inset 0 0 40px rgba(0,0,0,0.02),
            5px 15px 30px rgba(0,0,0,0.1),
            -5px 15px 20px rgba(0,0,0,0.05)
          `,
          borderRight: "1px solid rgba(0,0,0,0.05)",
          borderBottom: "1px solid rgba(0,0,0,0.05)"
        }}
      >
        {/* Soft paper curl fold effect on bottom right setup */}
        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none" style={{
          background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.04) 50%)",
        }}></div>

        {/* Top Fold / Pin Highlight */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-black/5 opacity-30"></div>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm z-20 border border-white/50"></div>

        <div className="mt-2 flex flex-col gap-3 mb-4 pb-3 border-b border-black/10">
          <div className="flex justify-between items-center">
            <h3 className="font-cursive font-bold opacity-70 text-3xl tracking-wide text-black/80">
              {dateLabel}
            </h3>
            {!isEditing && note && (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(true)} className="p-2 rounded-xl hover:bg-black/5 opacity-60 hover:opacity-100 transition-all text-black">
                  <Edit3 size={18} />
                </button>
                <button onClick={deleteNote} className="p-2 rounded-xl hover:bg-black/5 opacity-60 hover:opacity-100 transition-all text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Emotional Mood Tracker */}
          {isSingleDate && (
            <div className="flex items-center gap-2 mt-1">
              {MOODS.map(m => {
                const isActive = mood?.emoji === m.emoji;
                return (
                  <motion.button 
                    key={m.emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateMood(m)}
                    className={`text-2xl transition-all duration-300 relative ${isActive ? 'scale-110 grayscale-0 opacity-100' : 'grayscale-[50%] opacity-40 hover:grayscale-0 hover:opacity-100'}`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-white/50 blur-md rounded-full -z-10 animate-pulse"></div>
                    )}
                    {m.emoji}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              key="edit"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col relative z-10"
            >
              <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your heart out..."
                className="flex-1 w-full bg-transparent border-none outline-none resize-none font-cursive text-[2rem] leading-[2.5rem] tracking-tight text-black/80 placeholder:opacity-30 p-1 custom-scrollbar focus:ring-0"
                style={{
                  backgroundImage: "linear-gradient(transparent, transparent calc(2.5rem - 1px), rgba(0,0,0,0.1) calc(2.5rem - 1px), rgba(0,0,0,0.1) 2.5rem)",
                  backgroundSize: "100% 2.5rem",
                }}
              />
              <div className="flex justify-end mt-4">
                <motion.button 
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveNote}
                  className="px-6 py-2 bg-black/80 text-[#fff9c4] rounded-md font-sans font-medium text-sm transition-shadow shadow-md flex items-center gap-2"
                >
                  <Save size={16} /> Pin Note
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="view"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto pr-2 custom-scrollbar group cursor-text relative z-10"
              onDoubleClick={() => setIsEditing(true)}
            >
              {note ? (
                <div 
                  className="font-cursive text-[2rem] leading-[2.5rem] tracking-tight whitespace-pre-wrap text-black/80 pb-8"
                  style={{
                    backgroundImage: "linear-gradient(transparent, transparent calc(2.5rem - 1px), rgba(0,0,0,0.1) calc(2.5rem - 1px), rgba(0,0,0,0.1) 2.5rem)",
                    backgroundSize: "100% 2.5rem",
                  }}
                >
                  {note}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity cursor-pointer">
                  <p className="font-cursive text-3xl">Double tap to write...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
