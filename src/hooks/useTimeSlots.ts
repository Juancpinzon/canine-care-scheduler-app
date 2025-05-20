
import { useState, useEffect } from 'react';
import { isWeekend, isSunday } from 'date-fns';

export const useTimeSlots = (selectedDate: Date | undefined) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Different time slots for weekends vs weekdays
    let slots = [];
    if (isWeekend(selectedDate) && !isSunday(selectedDate)) {
      // Saturday hours
      slots = ["09:00", "10:30", "12:00", "13:30", "15:00"];
    } else if (!isSunday(selectedDate)) {
      // Weekday hours
      slots = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
    }
    
    setAvailableTimeSlots(slots);
  }, [selectedDate]);

  return { availableTimeSlots };
};
