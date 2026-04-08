"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  format, addYears, subYears, startOfYear, endOfYear, 
  eachMonthOfInterval, eachDayOfInterval, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isToday
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function YearlyView({ setViewMode, setSelectedDates, setCurrentMonth }) {
  const [currentYear, setCurrentYear] = useState(new Date());
  const [activityMap, setActivityMap] = useState({});

  const yearStart = startOfYear(currentYear);
  const yearEnd = endOfYear(currentYear);
  const months = useMemo(() => eachMonthOfInterval({ start: yearStart, end: yearEnd }), [currentYear]);

  useEffect(() => {
    // Generate activity map for the year
    const newActivityMap = {};
    const daysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });

    const rangeNotes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('petal-notes-')) {
        const d = key.replace('petal-notes-', '');
        if (d.includes('_')) {
          const [s, e] = d.split('_');
          rangeNotes.push({ s, e });
        }
      }
    }
    
    daysInYear.forEach(day => {
      const d = format(day, "yyyy-MM-dd");
      let active = false;
      let hasMood = false;
      let noteType = false;

      try {
        if (localStorage.getItem(`petal-mood-${d}`)) hasMood = true;
        if (localStorage.getItem(`petal-notes-${d}`)) noteType = 'single';
      } catch(e) {}

      if (!noteType) {
        for (let r of rangeNotes) {
          if (d >= r.s && d <= r.e) {
            noteType = 'range';
            break;
          }
        }
      }

      if (hasMood || noteType) {
        newActivityMap[d] = { hasMood, noteType };
      }
    });
    setActivityMap(newActivityMap);
  }, [currentYear]);

  const handleMonthClick = (month) => {
    setSelectedDates([format(month, 'yyyy-MM-dd')]);
    setCurrentMonth(month);
    setViewMode('monthly');
  };

  return (
    <div className="w-full flex md:block flex-col h-full">
      <div className="flex justify-between items-center mb-8 px-2 md:px-4 py-4 border-b border-black/5 relative z-10">
        <motion.button 
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentYear(subYears(currentYear, 1))}
          className="p-3 rounded-full hover:bg-[var(--theme-accent)]/20 transition-colors"
        >
          <ChevronLeft className="opacity-70" />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.h2 
            key={format(currentYear, 'yyyy')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-4xl md:text-5xl font-sans font-bold drop-shadow-sm text-[var(--theme-accent)] tracking-tight"
          >
            {format(currentYear, "yyyy")}
          </motion.h2>
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentYear(addYears(currentYear, 1))}
          className="p-3 rounded-full hover:bg-[var(--theme-accent)]/20 transition-colors"
        >
          <ChevronRight className="opacity-70" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 pb-8">
        {months.map(month => {
          const monthStartDay = startOfMonth(month);
          const monthEndDay = endOfMonth(month);
          const startDate = startOfWeek(monthStartDay);
          const endDate = endOfWeek(monthEndDay);
          const days = eachDayOfInterval({ start: startDate, end: endDate });

          return (
            <motion.div 
              key={month.toString()}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleMonthClick(month)}
              className="cursor-pointer group flex flex-col p-4 rounded-3xl bg-white/40 hover:bg-white/70 transition-colors border border-transparent hover:border-white/50 shadow-sm hover:shadow-md"
            >
              <h3 className="text-xl font-bold font-sans text-center mb-3 text-[var(--theme-text)] opacity-80 group-hover:opacity-100 group-hover:text-[var(--theme-accent)] transition-colors">
                {format(month, 'MMMM')}
              </h3>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold opacity-30">{d}</div>
                ))}
                
                {days.map((day, i) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isCurrentMonth = isSameMonth(day, month);
                  const activity = activityMap[dateStr];
                  const isTodayDate = isToday(day);

                  return (
                    <div key={i} className="aspect-square flex items-center justify-center p-[2px]">
                      <div className={cn(
                        "w-full h-full rounded-md text-[9px] flex items-center justify-center transition-all duration-300",
                        !isCurrentMonth && "opacity-0",
                        isCurrentMonth && "bg-black/5 group-hover:bg-black/10",
                        isTodayDate && isCurrentMonth && !activity && "border border-[var(--theme-accent)] text-[var(--theme-accent)] font-bold",
                        activity?.noteType === 'single' && !activity?.hasMood && "bg-[var(--theme-accent)]/40 text-black/80 font-bold shadow-sm",
                        activity?.noteType === 'range' && !activity?.hasMood && "bg-green-500 text-white font-bold shadow-sm",
                        activity?.hasMood && "bg-[var(--theme-accent)] text-white font-bold shadow-sm scale-110",
                      )}>
                        {isCurrentMonth ? format(day, 'd') : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
