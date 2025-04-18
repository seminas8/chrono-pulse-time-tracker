
import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/timeUtils";

interface TimeClockProps {
  startTime?: Date;
  endTime?: Date;
  isActive?: boolean;
}

const TimeClock = ({ startTime, endTime, isActive = false }: TimeClockProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  useEffect(() => {
    // If we have start and end times, calculate the fixed duration
    if (startTime && endTime) {
      const seconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      setElapsedSeconds(seconds);
      return;
    }
    
    // If active, start the timer
    if (isActive && startTime) {
      const interval = setInterval(() => {
        const seconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(seconds);
      }, 1000);
      
      return () => clearInterval(interval);
    }
    
    // Reset if not active and no fixed duration
    setElapsedSeconds(0);
    
  }, [startTime, endTime, isActive]);
  
  return (
    <div className="text-center">
      <div className="text-4xl font-mono font-semibold py-4">
        {formatDuration(elapsedSeconds)}
      </div>
    </div>
  );
};

export default TimeClock;
