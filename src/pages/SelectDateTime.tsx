
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import BookingProgress from "@/components/BookingProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { addDays } from "date-fns";
import { useServiceStore } from '@/stores/useServiceStore';
import { toast } from "sonner";
import DateSelector from '@/components/booking/DateSelector';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector';
import GroomerSelector from '@/components/booking/GroomerSelector';
import AppointmentSummary from '@/components/booking/AppointmentSummary';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { useLanguage } from '@/contexts/LanguageContext';

const SelectDateTime = () => {
  const navigate = useNavigate();
  const { primaryService, petInfo, appointment, setAppointmentInfo, getTotalPrice } = useServiceStore();
  const { t } = useLanguage();
  
  const [date, setDate] = useState<Date | undefined>(appointment.date || addDays(new Date(), 1));
  const [timeSlot, setTimeSlot] = useState<string>(appointment.timeSlot || "");
  const [groomer, setGroomer] = useState<string>(appointment.groomerId ? String(appointment.groomerId) : "any");
  
  const { availableTimeSlots } = useTimeSlots(date);

  // Mock groomers data
  const groomers = [
    { id: 1, name: "Ana López" },
    { id: 2, name: "Carlos Martínez" },
    { id: 3, name: "Laura Sánchez" }
  ];

  const handleContinue = () => {
    if (!date || !timeSlot) {
      toast.error("Selecciona fecha y hora", {
        description: "Para continuar, debes seleccionar una fecha y hora para la cita"
      });
      return;
    }

    setAppointmentInfo({
      date,
      timeSlot,
      groomerId: groomer !== "any" ? parseInt(groomer) : undefined
    });
    
    toast.success("Fecha y hora seleccionadas", {
      description: "Ahora puedes continuar con el pago"
    });
    navigate('/checkout');
  };

  if (!primaryService || !petInfo.name) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Primero debes seleccionar un servicio y una mascota</h2>
          <p className="mt-4">
            <Link to="/" className="text-spawblue hover:underline">
              {t('back')} {t('home')}
            </Link>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BookingProgress currentStep={3} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/select-pet" className="text-spawblue hover:text-spawblue-dark flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>{t('back')}</span>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">{t('selectDateTime')}</h1>
          <div className="w-20"></div> {/* For balancing the layout */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <DateSelector 
                  selectedDate={date} 
                  onDateChange={setDate} 
                />
                
                <TimeSlotSelector 
                  date={date}
                  availableTimeSlots={availableTimeSlots}
                  selectedTimeSlot={timeSlot}
                  onTimeSlotChange={setTimeSlot}
                />
                
                <GroomerSelector 
                  groomers={groomers}
                  selectedGroomer={groomer}
                  onGroomerChange={setGroomer}
                />
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleContinue}
                    className="bg-spawblue hover:bg-spawblue-dark flex items-center gap-2"
                    disabled={!date || !timeSlot}
                  >
                    {t('continue')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            {primaryService && (
              <AppointmentSummary 
                serviceName={primaryService.name}
                petName={petInfo.name || ""}
                petSize={petInfo.size}
                petCoat={petInfo.coat}
                date={date}
                timeSlot={timeSlot}
                groomer={groomer}
                groomers={groomers}
                totalPrice={getTotalPrice()}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectDateTime;
