
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import BookingProgress from "@/components/BookingProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Service, services, getPriceByPetAttributes } from "@/data/services";
import { DogSize, CoatType, useServiceStore } from '@/stores/useServiceStore';
import { toast } from "sonner";

const ServiceDetails = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [size, setSize] = useState<DogSize>('Medium');
  const [coat, setCoat] = useState<CoatType>('Flat');
  const [price, setPrice] = useState<number>(0);
  
  const { setPrimaryService, setPetInfo } = useServiceStore();

  useEffect(() => {
    if (serviceType) {
      const foundService = services.find(
        s => s.serviceType.toLowerCase().replace(' ', '-') === serviceType
      );
      
      if (foundService) {
        setService(foundService);
        setPrimaryService(foundService.id, foundService.name);
        const calculatedPrice = getPriceByPetAttributes(foundService.id, size, coat);
        setPrice(calculatedPrice);
      }
    }
  }, [serviceType, setPrimaryService]);

  useEffect(() => {
    if (service) {
      const calculatedPrice = getPriceByPetAttributes(service.id, size, coat);
      setPrice(calculatedPrice);
    }
  }, [service, size, coat]);

  const handleSizeChange = (value: string) => {
    setSize(value as DogSize);
  };

  const handleCoatChange = (value: string) => {
    setCoat(value as CoatType);
  };

  const handleContinue = () => {
    setPetInfo({ size, coat });
    toast.success("Información guardada", {
      description: "Continúa eligiendo o registrando tu mascota"
    });
    navigate('/select-pet');
  };

  if (!service) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Servicio no encontrado</h2>
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
      <BookingProgress currentStep={1} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-spawblue hover:text-spawblue-dark flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver</span>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">{service.name}</h1>
          <div className="w-20"></div> {/* For balancing the layout */}
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            {service.image && (
              <div className="relative h-48 w-full mb-6 overflow-hidden rounded-md">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Duración aproximada</h3>
                  <p className="font-semibold">{service.durationMinutes} minutos</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Precio base</h3>
                  <p className="font-semibold">{service.basePrice} €</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Personaliza para tu mascota</h2>
                  <p className="text-gray-600 mb-4">
                    El precio final dependerá del tamaño y tipo de pelaje de tu mascota.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Tamaño del perro</h3>
                  <RadioGroup
                    defaultValue="Medium"
                    value={size}
                    onValueChange={handleSizeChange}
                    className="grid grid-cols-2 md:grid-cols-5 gap-2"
                  >
                    {['Small', 'Medium', 'Large', 'XL', 'XXL'].map((dogSize) => (
                      <div key={dogSize} className="flex items-center">
                        <RadioGroupItem value={dogSize} id={`size-${dogSize}`} className="peer sr-only" />
                        <Label
                          htmlFor={`size-${dogSize}`}
                          className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-spawblue peer-data-[state=checked]:text-spawblue cursor-pointer"
                        >
                          {dogSize}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Tipo de pelaje</h3>
                  <RadioGroup
                    defaultValue="Flat"
                    value={coat}
                    onValueChange={handleCoatChange}
                    className="grid grid-cols-3 gap-2"
                  >
                    {['Flat', 'Coiled', 'Double'].map((coatType) => (
                      <div key={coatType} className="flex items-center">
                        <RadioGroupItem value={coatType} id={`coat-${coatType}`} className="peer sr-only" />
                        <Label
                          htmlFor={`coat-${coatType}`}
                          className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-spawblue peer-data-[state=checked]:text-spawblue cursor-pointer"
                        >
                          {coatType}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="bg-spawblue/10 p-3 rounded-md mt-3 text-xs">
                    <p><strong>Flat:</strong> Pelo corto y liso (Labrador, Beagle)</p>
                    <p><strong>Coiled:</strong> Pelo rizado o con ondas (Caniche, Bichón)</p>
                    <p><strong>Double:</strong> Doble capa de pelo (Pastor Alemán, Husky)</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Precio calculado</h3>
                  <p className="text-2xl font-bold">{price} €</p>
                </div>
                <Button
                  onClick={handleContinue}
                  className="bg-spawblue hover:bg-spawblue-dark flex items-center gap-2"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceDetails;
