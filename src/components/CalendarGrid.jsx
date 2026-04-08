"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  format, addMonths, subMonths, startOfWeek, endOfWeek, 
  startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, isBefore, isAfter 
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const flipVariants = {
  enter: (direction) => ({
    rotateY: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    rotateY: direction < 0 ? 60 : -60,
    opacity: 0,
    scale: 0.95,
  })
};

export default function CalendarGrid({ selectedDates, setSelectedDates, currentMonth, setCurrentMonth }) {
  const [direction, setDirection] = useState(0);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [moodMap, setMoodMap] = useState({});
  const [noteMap, setNoteMap] = useState({});

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [currentMonth]);

  useEffect(() => {
    // Initial fetch on month change
    const newMoodMap = {};
    const newNoteMap = {};
    
    const rangeNotes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('petal-notes-')) {
        const d = key.replace('petal-notes-', '');
        if (d.includes('_')) {
          const [s, e] = d.split('_');
          rangeNotes.push({ s, e });
        } else {
          newNoteMap[d] = 'single';
        }
      }
    }

    days.forEach(day => {
      const d = format(day, "yyyy-MM-dd");
      try {
        const m = localStorage.getItem(`petal-mood-${d}`);
        if (m) newMoodMap[d] = JSON.parse(m);
      } catch(e) {}
      
      if (!newNoteMap[d]) {
        for (let r of rangeNotes) {
          if (d >= r.s && d <= r.e) {
            newNoteMap[d] = 'range';
            break;
          }
        }
      }
    });

    setMoodMap(newMoodMap);
    setNoteMap(newNoteMap);

    const handleMood = (e) => {
      const { date, mood } = e.detail;
      setMoodMap(prev => ({ ...prev, [date]: mood }));
    };
    const handleNote = (e) => {
      const { date, hasNote } = e.detail;
      setNoteMap(prev => {
        const next = { ...prev };
        if (date.includes('_')) {
          const [s, eDate] = date.split('_');
          days.forEach(day => {
            const d = format(day, "yyyy-MM-dd");
            if (d >= s && d <= eDate) next[d] = hasNote ? 'range' : false;
          });
        } else {
          next[date] = hasNote ? 'single' : false;
        }
        return next;
      });
    };
    
    window.addEventListener('petal-mood-updated', handleMood);
    window.addEventListener('petal-note-updated', handleNote);
    return () => {
      window.removeEventListener('petal-mood-updated', handleMood);
      window.removeEventListener('petal-note-updated', handleNote);
    };
  }, [currentMonth]); // Perfectly stable

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (day) => {
    if (selectedDates.length === 0 || selectedDates.length === 2) {
      setSelectedDates([format(day, 'yyyy-MM-dd')]);
    } else {
      const start = new Date(selectedDates[0]);
      if (isBefore(day, start)) {
        setSelectedDates([format(day, 'yyyy-MM-dd'), selectedDates[0]]);
      } else {
        setSelectedDates([selectedDates[0], format(day, 'yyyy-MM-dd')]);
      }
    }
  };

  const getDayStatus = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isStart = selectedDates[0] === dateStr;
    const isEnd = selectedDates[1] === dateStr;
    const isSingle = selectedDates.length === 1 && isStart;
    
    let isBetween = false;
    if (selectedDates.length === 2) {
      const start = new Date(selectedDates[0]);
      const end = new Date(selectedDates[1]);
      isBetween = isAfter(day, start) && isBefore(day, end);
    }

    return { isStart, isEnd, isSingle, isBetween };
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-8 px-4">
        <motion.button 
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="p-3 rounded-full hover:bg-[var(--theme-accent)]/20 transition-colors"
        >
          <ChevronLeft className="opacity-70" />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.h2 
            key={format(currentMonth, 'yyyy-MM')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-4xl md:text-5xl font-cursive font-bold drop-shadow-sm text-[var(--theme-accent)]"
          >
            {format(currentMonth, "MMMM yyyy")}
          </motion.h2>
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="p-3 rounded-full hover:bg-[var(--theme-accent)]/20 transition-colors"
        >
          <ChevronRight className="opacity-70" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center border-b border-black/5 pb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-sans font-semibold opacity-40 text-sm tracking-wider uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="relative" style={{ perspective: "1500px" }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={format(currentMonth, 'yyyy-MM')}
            custom={direction}
            variants={flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 120, damping: 24 }}
            className="grid grid-cols-7 gap-y-4 gap-x-2 md:gap-4 mt-4 origin-left md:origin-center"
          >
            {days.map((day) => {
              const { isStart, isEnd, isSingle, isBetween } = getDayStatus(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const today = isToday(day);
              const dateStr = format(day, 'yyyy-MM-dd');
              const hovered = hoveredDay === dateStr;
              
              const dayMood = moodMap[dateStr];
              const noteType = noteMap[dateStr];

              const showConnectorLeft = isEnd || isBetween;
              const showConnectorRight = isStart || isBetween;

              return (
                <div 
                  key={day.toString()} 
                  className="relative flex flex-col items-center justify-center h-12 md:h-16"
                  onMouseEnter={() => setHoveredDay(dateStr)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {selectedDates.length === 2 && showConnectorLeft && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-4/5 bg-[var(--theme-accent)] opacity-20" />
                  )}
                  {selectedDates.length === 2 && showConnectorRight && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-4/5 bg-[var(--theme-accent)] opacity-20" />
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDateClick(day)}
                    style={dayMood ? { 
                      boxShadow: `0 0 25px -2px ${dayMood.glow}, inset 0 0 10px ${dayMood.glow}`,
                      borderColor: 'transparent'
                    } : {}}
                    className={cn(
                      "relative z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-sans text-base md:text-lg transition-all duration-300",
                      !isCurrentMonth && "opacity-30",
                      isCurrentMonth && "hover:bg-[var(--theme-accent)]/10 shadow-sm",
                      today && !isStart && !isEnd && !isBetween && !dayMood && "border border-[var(--theme-accent)] text-[var(--theme-accent)] font-bold",
                      dayMood && "bg-white/80 font-bold mix-blend-luminosity",
                      (isStart || isEnd || isSingle) && "bg-[var(--theme-accent)] text-white shadow-md shadow-[var(--theme-accent)] font-bold transform scale-110",
                      isBetween && "bg-[var(--theme-accent)] opacity-80 text-white font-medium shadow-inner"
                    )}
                  >
                    {format(day, 'd')}
                    
                    {dayMood && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 text-sm z-20 pointer-events-none drop-shadow-md"
                      >
                        {dayMood.emoji}
                      </motion.div>
                    )}

                    {hovered && isCurrentMonth && !(isStart || isEnd) && !dayMood && (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                         animate={{ opacity: 1, scale: 1, rotate: 0 }}
                         className="absolute -top-3 -right-2 text-yellow-400 drop-shadow-sm pointer-events-none"
                       >
                         <Sparkles size={14} fill="currentColor" />
                       </motion.div>
                    )}
                  </motion.button>
                  
                  {noteType && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "absolute bottom-0 md:-bottom-1 w-1.5 h-1.5 rounded-full z-20 pointer-events-none",
                        noteType === 'range'
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                          : "bg-[var(--theme-accent)] shadow-[0_0_8px_var(--theme-accent)]"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
