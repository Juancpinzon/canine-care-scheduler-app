
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import BookingProgress from "@/components/BookingProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useServiceStore } from '@/stores/useServiceStore';
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { primaryService, petInfo, appointment, addOns, getTotalPrice, resetSelections } = useServiceStore();
  
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      toast.success("¡Reserva confirmada!", {
        description: "Hemos enviado los detalles de la cita a tu email"
      });
    }, 2000);
  };

  const handleNewReservation = () => {
    resetSelections();
    navigate('/');
  };

  if (!primaryService || !petInfo.name || !appointment.date || !appointment.timeSlot) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Información de reserva incompleta</h2>
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
      <BookingProgress currentStep={4} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/select-datetime" className="text-spawblue hover:text-spawblue-dark flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver</span>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">Pago y Confirmación</h1>
          <div className="w-20"></div> {/* For balancing the layout */}
        </div>

        {paymentComplete ? (
          <Card className="mb-8 border-spawgreen">
            <CardContent className="pt-6 text-center">
              <div className="w-20 h-20 bg-spawgreen/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-spawgreen" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">¡Reserva Confirmada!</h2>
              <p className="text-muted-foreground mb-6">
                Tu cita ha sido programada correctamente. Hemos enviado un email de confirmación con todos los detalles.
              </p>
              
              <div className="bg-muted p-4 rounded-lg max-w-md mx-auto mb-8">
                <div className="grid grid-cols-2 gap-y-4 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Servicio</p>
                    <p className="font-medium">{primaryService.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mascota</p>
                    <p className="font-medium">{petInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">{format(appointment.date!, "d 'de' MMMM", { locale: es })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium">{appointment.timeSlot}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="default" 
                className="bg-spawblue hover:bg-spawblue-dark"
                onClick={handleNewReservation}
              >
                Hacer nueva reserva
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-lg font-medium mb-6">Información de Pago</div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" placeholder="Tu nombre" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellidos</Label>
                        <Input id="lastName" placeholder="Tus apellidos" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="123456789" />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="text-lg font-medium mb-6">Método de Pago</div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Fecha expiración</Label>
                        <Input id="expiryDate" placeholder="MM/AA" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="bg-spawgreen hover:bg-spawgreen-dark w-full md:w-auto"
                    >
                      {isProcessing ? "Procesando..." : "Confirmar y Pagar"}
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
                      <p className="text-sm text-muted-foreground">{primaryService.price} €</p>
                    </div>
                    
                    {addOns.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Servicios adicionales</h3>
                        {addOns.map((addon) => (
                          <div key={addon.serviceId} className="flex justify-between">
                            <p className="text-sm">{addon.name}</p>
                            <p className="text-sm">{addon.price} €</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Mascota</h3>
                      <p className="font-medium">{petInfo.name}</p>
                      <p className="text-xs">{petInfo.size} - {petInfo.coat}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Fecha y hora</h3>
                      <p className="font-medium">
                        {format(appointment.date!, "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                      <p className="text-sm">{appointment.timeSlot}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">Subtotal</h3>
                        <p className="font-medium">{getTotalPrice()} €</p>
                      </div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">IVA (21%)</h3>
                        <p className="font-medium">{(getTotalPrice() * 0.21).toFixed(2)} €</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <h3 className="font-semibold">Total</h3>
                      <p className="text-xl font-bold">{(getTotalPrice() * 1.21).toFixed(2)} €</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
