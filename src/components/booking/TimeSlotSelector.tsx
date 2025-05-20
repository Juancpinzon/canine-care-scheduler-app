
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useLanguage } from '@/contexts/LanguageContext';

interface TimeSlotSelectorProps {
  date: Date | undefined;
  availableTimeSlots: string[];
  selectedTimeSlot: string;
  onTimeSlotChange: (timeSlot: string) => void;
}

const TimeSlotSelector = ({ 
  date, 
  availableTimeSlots, 
  selectedTimeSlot, 
  onTimeSlotChange 
}: TimeSlotSelectorProps) => {
  const { t, language } = useLanguage();
  
  if (!date) return null;
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">
        {t('availableTimesFor')} {format(date, "d 'de' MMMM", { locale: language === 'es' ? es : undefined })}
      </h2>
      
      {availableTimeSlots.length > 0 ? (
        <RadioGroup
          value={selectedTimeSlot}
          onValueChange={onTimeSlotChange}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {availableTimeSlots.map((time) => (
            <div key={time} className="flex items-center">
              <RadioGroupItem value={time} id={`time-${time}`} className="peer sr-only" />
              <Label
                htmlFor={`time-${time}`}
                className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-spawblue peer-data-[state=checked]:text-spawblue cursor-pointer"
              >
                {time}
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="text-center py-4 mb-6">
          <p className="text-red-500">{t('noTimesAvailable')}</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
