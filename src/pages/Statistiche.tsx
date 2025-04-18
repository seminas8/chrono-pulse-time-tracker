
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import StatisticsCard from "@/components/ui/StatisticsCard";
import { useApp } from "@/context/AppContext";
import { MonthlyStats } from "@/types";
import { getMonthlyStats, getMonthName } from "@/lib/timeUtils";

const Statistiche = () => {
  const { timeEntries } = useApp();
  const currentDate = new Date();
  
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  
  // Calculate stats for the selected month
  const monthStats = getMonthlyStats(timeEntries, selectedMonth, selectedYear);
  
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <Header title="Statistiche" />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <div className="text-lg font-semibold capitalize">
              {getMonthName(selectedMonth)} {selectedYear}
            </div>
          </div>
          
          <button 
            onClick={goToNextMonth}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <StatisticsCard stats={monthStats} />
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Confronto con mesi precedenti</h3>
          
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => {
              const monthIndex = (selectedMonth - i - 1 + 12) % 12;
              const yearOffset = selectedMonth - i - 1 < 0 ? -1 : 0;
              const year = selectedYear + yearOffset;
              
              const previousStats = getMonthlyStats(timeEntries, monthIndex, year);
              
              // Calculate percentage change
              const percentChange = monthStats.totalHours > 0 && previousStats.totalHours > 0
                ? ((monthStats.totalHours - previousStats.totalHours) / previousStats.totalHours) * 100
                : 0;
              
              return (
                <div key={`${monthIndex}-${year}`} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">{getMonthName(monthIndex)}</div>
                    <div className="text-sm text-gray-600">{previousStats.totalHours.toFixed(2)} ore</div>
                  </div>
                  
                  {percentChange !== 0 && (
                    <div className={`text-sm font-medium ${percentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Statistiche;
