
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import BookingProgress from "@/components/BookingProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, isWeekend, isSunday } from "date-fns";
import { es } from "date-fns/locale";
import { useServiceStore } from '@/stores/useServiceStore';
import { toast } from "sonner";

const SelectDateTime = () => {
  const navigate = useNavigate();
  const { primaryService, petInfo, appointment, setAppointmentInfo, getTotalPrice } = useServiceStore();
  
  const [date, setDate] = useState<Date | undefined>(appointment.date || addDays(new Date(), 1));
  const [timeSlot, setTimeSlot] = useState<string>(appointment.timeSlot || "");
  const [groomer, setGroomer] = useState<string>(appointment.groomerId ? String(appointment.groomerId) : "any");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Mock time slots based on selected date
  useEffect(() => {
    if (!date) return;
    
    // Different time slots for weekends vs weekdays
    let slots = [];
    if (isWeekend(date) && !isSunday(date)) {
      // Saturday hours
      slots = ["09:00", "10:30", "12:00", "13:30", "15:00"];
    } else if (!isSunday(date)) {
      // Weekday hours
      slots = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
    }
    
    setAvailableTimeSlots(slots);
    
    // Clear selected time if it's not available on the new date
    if (timeSlot && !slots.includes(timeSlot)) {
      setTimeSlot("");
    }
  }, [date, timeSlot]);

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
              Volver al inicio
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
            <span>Volver</span>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">Selecciona Fecha y Hora</h1>
          <div className="w-20"></div> {/* For balancing the layout */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Selecciona una fecha</h2>
                  <div className="mb-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border mx-auto pointer-events-auto"
                      locale={es}
                      disabled={(date) => {
                        // Disable past dates, today, and Sundays
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < addDays(today, 1) || date.getDay() === 0;
                      }}
                    />
                  </div>
                </div>
                
                {date && availableTimeSlots.length > 0 && (
                  <div>
                    <h2 className="text-lg font-medium mb-4">
                      Horarios disponibles para el {format(date, "d 'de' MMMM", { locale: es })}
                    </h2>
                    
                    <RadioGroup
                      value={timeSlot}
                      onValueChange={setTimeSlot}
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
                  </div>
                )}
                
                {date && availableTimeSlots.length === 0 && (
                  <div className="text-center py-4 mb-6">
                    <p className="text-red-500">No hay horarios disponibles para esta fecha. Por favor, selecciona otra fecha.</p>
                  </div>
                )}
                
                <div>
                  <h2 className="text-lg font-medium mb-4">Peluquero preferido</h2>
                  <Select value={groomer} onValueChange={setGroomer}>
                    <SelectTrigger className="w-full mb-6">
                      <SelectValue placeholder="Selecciona un peluquero (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Cualquiera disponible</SelectItem>
                      {groomers.map((g) => (
                        <SelectItem key={g.id} value={g.id.toString()}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleContinue}
                    className="bg-spawblue hover:bg-spawblue-dark flex items-center gap-2"
                    disabled={!date || !timeSlot}
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="text-lg font-medium mb-4">Resumen</div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Servicio</h3>
                    <p className="font-medium">{primaryService.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Mascota</h3>
                    <p className="font-medium">{petInfo.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tamaño</h3>
                    <p className="font-medium">{petInfo.size}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tipo de Pelaje</h3>
                    <p className="font-medium">{petInfo.coat}</p>
                  </div>
                  
                  {date && timeSlot && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Fecha</h3>
                        <p className="font-medium">{format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Hora</h3>
                        <p className="font-medium">{timeSlot}</p>
                      </div>
                    </>
                  )}
                  
                  {groomer !== "any" && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Peluquero</h3>
                      <p className="font-medium">
                        {groomers.find(g => g.id.toString() === groomer)?.name}
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Precio Total</h3>
                    <p className="text-2xl font-bold">${getTotalPrice()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectDateTime;
