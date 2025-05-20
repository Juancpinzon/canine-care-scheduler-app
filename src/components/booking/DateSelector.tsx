
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isWeekend, isSunday } from "date-fns";
import { es } from "date-fns/locale";
import { useLanguage } from '@/contexts/LanguageContext';

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">{t('selectDate')}</h2>
      <div className="mb-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="rounded-md border mx-auto pointer-events-auto"
          locale={language === 'es' ? es : undefined}
          disabled={(date) => {
            // Disable past dates, today, and Sundays
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < addDays(today, 1) || date.getDay() === 0;
          }}
        />
      </div>
    </div>
  );
};

export default DateSelector;
