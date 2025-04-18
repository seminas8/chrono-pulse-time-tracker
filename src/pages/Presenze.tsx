
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, parseISO } from "date-fns";
import { Filter } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import TimeEntryCard from "@/components/ui/TimeEntryCard";
import CalendarView from "@/components/ui/CalendarView";
import { useApp } from "@/context/AppContext";
import { TimeEntry } from "@/types";
import { formatDate } from "@/lib/timeUtils";

const Presenze = () => {
  const { timeEntries, unfinishedSessions } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  
  // Update filtered entries when timeEntries or selectedDate changes
  useEffect(() => {
    const filtered = timeEntries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      return (
        entryDate.getDate() === selectedDate.getDate() &&
        entryDate.getMonth() === selectedDate.getMonth() &&
        entryDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    // Sort by start time, most recent first
    filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    
    setFilteredEntries(filtered);
  }, [timeEntries, selectedDate]);
  
  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };
  
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Header 
        title="Elenco Presenze" 
        rightElement={
          <button 
            onClick={toggleCalendar}
            className="p-1 rounded-full hover:bg-blue-800"
          >
            <Filter size={24} />
          </button>
        }
      />
      
      {unfinishedSessions.length > 0 && (
        <div className="bg-yellow-100 p-3 mb-4 mx-4 mt-3 rounded-lg">
          <h3 className="text-yellow-800 font-semibold mb-1">Sessioni incomplete</h3>
          {unfinishedSessions.map(session => (
            <div key={session.id} className="bg-white rounded p-2 mb-2 text-sm">
              <div className="flex justify-between">
                <span>{formatDate(session.startTime)}</span>
                <button className="text-blue-600 text-xs font-medium">
                  Chiudi sessione
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showCalendar ? (
        <div className="p-4">
          <CalendarView onSelectDay={handleSelectDay} />
        </div>
      ) : (
        <div className="p-4">
          <div className="bg-gray-500 text-white px-4 py-2 rounded-t-lg mb-px">
            <div className="font-medium">{formatDate(selectedDate)}</div>
            {isToday(selectedDate) && <div className="text-xs">Oggi</div>}
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="bg-white p-8 text-center text-gray-500 rounded-b-lg">
              Nessuna timbratura per questa data
            </div>
          ) : (
            <div>
              {filteredEntries.map(entry => (
                <TimeEntryCard key={entry.id} entry={entry} showDate={false} />
              ))}
            </div>
          )}
          
          <button
            onClick={toggleCalendar}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg"
          >
            Visualizza calendario
          </button>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default Presenze;
