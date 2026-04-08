"use client";

import { useState, useEffect } from "react";
import { format, compareDesc, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { PenTool, CalendarHeart, Calendar, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgendaView() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const map = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      if (key.startsWith("petal-notes-")) {
        const dateStr = key.replace("petal-notes-", "");
        if (!map[dateStr]) map[dateStr] = { date: dateStr };
        map[dateStr].note = localStorage.getItem(key);
      }
      if (key.startsWith("petal-mood-")) {
        const dateStr = key.replace("petal-mood-", "");
        if (dateStr.includes("_")) continue; // Skip range dates if any
        if (!map[dateStr]) map[dateStr] = { date: dateStr };
        try {
          map[dateStr].mood = JSON.parse(localStorage.getItem(key));
        } catch(e){}
      }
    }

    const arr = Object.values(map).filter(e => e.note || e.mood).sort((a, b) => {
      // Just simple string comparison since it's YYYY-MM-DD
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });

    setEntries(arr);
  }, []);

  if (entries.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-white/20 rounded-[2.5rem] border border-white/40 shadow-sm backdrop-blur-md">
        <CalendarHeart size={48} className="opacity-40 mb-4" />
        <h3 className="text-3xl font-cursive font-bold opacity-70">No memories yet...</h3>
        <p className="opacity-50 mt-2">Go to the monthly view to add your first note.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar p-2 pb-24 relative space-y-8 pr-4">
      {/* Timeline line */}
      <div className="absolute left-12 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[var(--theme-accent)] via-[var(--theme-accent)] to-transparent opacity-30 z-0"></div>

      {entries.map((entry, idx) => {
        const isRange = entry.date.includes('_');
        let dateLabel = "";
        let dayLabel = "";
        
        try {
          if (isRange) {
            const [startStr, endStr] = entry.date.split('_');
            const startObj = parseISO(startStr);
            const endObj = parseISO(endStr);
            dateLabel = `${format(startObj, "MMM d")} - ${format(endObj, "MMM d, yyyy")}`;
            dayLabel = "Range";
          } else {
            const dateObj = parseISO(entry.date);
            dateLabel = format(dateObj, "MMMM d, yyyy");
            dayLabel = format(dateObj, "EEEE");
          }
        } catch (e) {
          dateLabel = "Unknown Date";
          dayLabel = "???";
        }
        
        return (
          <motion.div 
            key={entry.date}
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: idx * 0.1, ease: "easeOut" }}
            className="relative z-10 flex gap-6 md:gap-8 group"
          >
            {/* Timeline Marker */}
            <div className="flex flex-col items-center mt-2">
              <div className={cn(
                "w-8 h-8 rounded-full border-2 shadow-sm flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform",
                isRange ? "bg-green-50 border-green-400" : "bg-[var(--theme-bg)] border-[var(--theme-accent)]"
              )}>
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  isRange ? "bg-green-500" : "bg-[var(--theme-accent)]"
                )}></div>
              </div>
            </div>

            {/* Content Card */}
            <div className="flex-1">
              <div className="flex items-end gap-3 mb-2">
                <h3 className={cn(
                  "text-2xl font-sans font-bold opacity-90",
                  isRange ? "text-green-500 drop-shadow-sm" : "text-[var(--theme-text)]"
                )}>
                  {dateLabel}
                </h3>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full mb-1 uppercase tracking-wider flex items-center gap-1",
                  isRange ? "bg-green-500 text-white shadow-sm" : "bg-[var(--theme-accent)]/20 text-[var(--theme-text)] opacity-80"
                )}>
                  {isRange ? <CalendarDays size={12} /> : <Calendar size={12} />}
                  {isRange ? "Range Task" : "Single Task"}
                </span>
                {!isRange && (
                  <span className="text-sm font-semibold opacity-50 mb-1 leading-6 ml-2">
                    {dayLabel}
                  </span>
                )}
              </div>
              
              <div className={cn(
                "backdrop-blur-md p-6 rounded-2xl border transition-shadow",
                isRange 
                  ? "bg-green-50/10 border-green-400/50 shadow-[0_4px_20px_rgba(34,197,94,0.15)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.25)]" 
                  : "bg-white/70 border-black/5 shadow-sm hover:shadow-md"
              )}>
                {entry.mood && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl filter drop-shadow-sm">{entry.mood.emoji}</span>
                  </div>
                )}
                
                {entry.note ? (
                  <p className="font-cursive text-2xl leading-relaxed text-black/80 whitespace-pre-wrap">
                    {entry.note}
                  </p>
                ) : (
                  <p className="font-cursive text-xl opacity-40 italic flex items-center gap-2">
                    <PenTool size={16} /> Only felt the mood this day.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
