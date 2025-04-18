
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { it } from "date-fns/locale";
import { useApp } from "@/context/AppContext";
import { getDailyStats } from "@/lib/timeUtils";

interface CalendarViewProps {
  onSelectDay: (date: Date) => void;
}

const CalendarView = ({ onSelectDay }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { timeEntries } = useApp();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const getDayClassNames = (day: Date) => {
    const stats = getDailyStats(timeEntries, day);
    
    let colorClass = "";
    
    switch (stats.status) {
      case "complete":
        colorClass = "bg-green-100 text-green-800 border-green-300";
        break;
      case "incomplete":
        colorClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
        break;
      case "missing":
        colorClass = "bg-red-100 text-red-800 border-red-300";
        break;
      default:
        colorClass = "bg-white border-gray-300";
    }
    
    return `
      cursor-pointer rounded-md border p-2 m-0.5 text-center
      ${colorClass}
      ${isToday(day) ? "ring-2 ring-app-blue" : ""}
      ${!isSameMonth(day, currentMonth) ? "opacity-50" : ""}
    `;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="mr-2" size={20} />
          <h2 className="text-lg font-semibold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: it })}
          </h2>
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-gray-600 text-xs font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-0">
        {days.map(day => {
          const dayNumber = day.getDate();
          
          // Apply offset for first day of month (Monday is 1)
          if (dayNumber === 1) {
            const weekday = day.getDay() || 7; // Convert Sunday (0) to 7
            return (
              <>
                {Array.from({ length: weekday - 1 }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2 m-0.5"></div>
                ))}
                <div 
                  key={day.toISOString()} 
                  className={getDayClassNames(day)}
                  onClick={() => onSelectDay(day)}
                >
                  {dayNumber}
                </div>
              </>
            );
          }
          
          return (
            <div 
              key={day.toISOString()} 
              className={getDayClassNames(day)}
              onClick={() => onSelectDay(day)}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 grid grid-cols-3 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></div>
          <span>Completo</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-1"></div>
          <span>Incompleto</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-1"></div>
          <span>Mancante</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
