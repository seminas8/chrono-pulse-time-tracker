
import { TimeEntry, DailyStats, MonthlyStats } from "@/types";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, differenceInSeconds } from "date-fns";
import { it } from "date-fns/locale";

// Format date in Italian format (DD/MM/YYYY)
export const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: it });
};

// Format time (HH:MM:SS)
export const formatTime = (date: Date): string => {
  return format(date, "HH:mm:ss");
};

// Format time (HH:MM)
export const formatTimeShort = (date: Date): string => {
  return format(date, "HH:mm");
};

// Calculate duration in seconds between two dates
export const getDurationInSeconds = (start: Date, end: Date): number => {
  return differenceInSeconds(end, start);
};

// Format seconds to HH:MM:SS
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Format duration in hours with 2 decimal places
export const formatDurationHours = (seconds: number): number => {
  return Math.round((seconds / 3600) * 100) / 100;
};

// Check if a time entry is active (has startTime but no endTime)
export const isTimeEntryActive = (entry: TimeEntry): boolean => {
  return entry.startTime !== undefined && entry.endTime === undefined;
};

// Get active time entry if exists
export const getActiveTimeEntry = (entries: TimeEntry[]): TimeEntry | undefined => {
  return entries.find(isTimeEntryActive);
};

// Calculate daily stats
export const getDailyStats = (entries: TimeEntry[], date: Date): DailyStats => {
  const dateString = format(date, "yyyy-MM-dd");
  
  const dayEntries = entries.filter(entry => {
    const entryDate = format(entry.startTime, "yyyy-MM-dd");
    return entryDate === dateString;
  });
  
  let totalSeconds = 0;
  let hasIncomplete = false;
  
  dayEntries.forEach(entry => {
    if (entry.endTime) {
      totalSeconds += getDurationInSeconds(entry.startTime, entry.endTime);
    } else {
      hasIncomplete = true;
    }
  });
  
  let status: 'complete' | 'incomplete' | 'missing' | 'empty' = 'empty';
  
  if (dayEntries.length > 0) {
    if (hasIncomplete) {
      status = 'incomplete';
    } else {
      status = 'complete';
    }
  } else {
    // If today or past, mark as missing, otherwise empty
    const today = new Date();
    if (date <= today) {
      status = 'missing';
    }
  }
  
  return {
    date,
    totalHours: formatDurationHours(totalSeconds),
    entries: dayEntries.length,
    status
  };
};

// Calculate monthly stats
export const getMonthlyStats = (entries: TimeEntry[], month: number, year: number): MonthlyStats => {
  const startDate = startOfMonth(new Date(year, month, 1));
  const endDate = endOfMonth(startDate);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const entriesByProject: { [projectId: string]: number } = {};
  const entriesByActivity: { [activityId: string]: number } = {};
  
  let totalSeconds = 0;
  let daysWorked = 0;
  const daysWithEntries = new Set<string>();
  
  days.forEach(day => {
    const dayStats = getDailyStats(entries, day);
    
    if (dayStats.entries > 0) {
      totalSeconds += dayStats.totalHours * 3600;
      daysWithEntries.add(format(day, "yyyy-MM-dd"));
    }
  });
  
  entries.forEach(entry => {
    const entryMonth = entry.startTime.getMonth();
    const entryYear = entry.startTime.getFullYear();
    
    if (entryMonth === month && entryYear === year && entry.endTime) {
      // Count by project
      entriesByProject[entry.projectId] = (entriesByProject[entry.projectId] || 0) + 1;
      
      // Count by activity
      entriesByActivity[entry.activityId] = (entriesByActivity[entry.activityId] || 0) + 1;
    }
  });
  
  daysWorked = daysWithEntries.size;
  
  const totalHours = formatDurationHours(totalSeconds);
  const avgHoursPerDay = daysWorked > 0 ? totalHours / daysWorked : 0;
  
  return {
    month,
    year,
    totalHours,
    avgHoursPerDay: Math.round(avgHoursPerDay * 100) / 100,
    daysWorked,
    entriesByProject,
    entriesByActivity
  };
};

// Get month name in Italian
export const getMonthName = (monthIndex: number): string => {
  return format(new Date(2021, monthIndex, 1), "MMMM", { locale: it });
};

// Check if a session was left open from yesterday
export const hasUnfinishedSessions = (entries: TimeEntry[]): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return entries.some(entry => {
    if (!entry.endTime) {
      const entryDate = new Date(entry.startTime);
      entryDate.setHours(0, 0, 0, 0);
      
      return entryDate < today;
    }
    return false;
  });
};

// Get unfinished sessions from previous days
export const getUnfinishedSessions = (entries: TimeEntry[]): TimeEntry[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return entries.filter(entry => {
    if (!entry.endTime) {
      const entryDate = new Date(entry.startTime);
      entryDate.setHours(0, 0, 0, 0);
      
      return entryDate < today;
    }
    return false;
  });
};
