
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import BookingProgress from "@/components/BookingProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { addOnServices } from "@/data/services";
import AddonServiceItem from "@/components/AddonServiceItem";
import { useServiceStore } from '@/stores/useServiceStore';
import { toast } from "sonner";

const SelectPet = () => {
  const navigate = useNavigate();
  const { primaryService, petInfo, setPetInfo, getTotalPrice } = useServiceStore();
  const [petName, setPetName] = useState<string>("");

  // Mock pet demo data (in a real app this would come from an API/database)
  const mockPets = [
    { id: 1, name: 'Max', breed: 'Bulldog', avatar: '/placeholder.svg' },
    { id: 2, name: 'Luna', breed: 'Poodle', avatar: '/placeholder.svg' }
  ];

  const handleContinue = () => {
    if (petName) {
      setPetInfo({ ...petInfo, name: petName });
      toast.success("Mascota seleccionada", {
        description: "Ahora puedes continuar con la selección de fecha y hora"
      });
      navigate('/select-datetime');
    } else {
      toast.error("Selecciona o añade una mascota", {
        description: "Para continuar, debes seleccionar una mascota existente o añadir una nueva"
      });
    }
  };

  const handleSelectPet = (name: string) => {
    setPetName(name);
  };

  if (!primaryService) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Primero debes seleccionar un servicio</h2>
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
      <BookingProgress currentStep={2} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to={`/service/${primaryService.name.toLowerCase().replace(' ', '-')}`} className="text-spawblue hover:text-spawblue-dark flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver</span>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">Selecciona tu Mascota</h1>
          <div className="w-20"></div> {/* For balancing the layout */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="text-lg font-medium mb-4">Tu mascota</div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {mockPets.map(pet => (
                    <div 
                      key={pet.id}
                      onClick={() => handleSelectPet(pet.name)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        petName === pet.name ? 'bg-spawblue/10 border-spawblue' : 'bg-white hover:bg-muted/50'
                      }`}
                    >
                      <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gray-200 overflow-hidden">
                        <img 
                          src={pet.avatar} 
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground">{pet.breed}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div 
                    onClick={() => {
                      const name = prompt('Nombre de tu mascota:');
                      if (name) {
                        setPetName(name);
                        toast.success("Mascota añadida", {
                          description: "Ahora puedes continuar con tu reserva"
                        });
                      }
                    }}
                    className="border border-dashed rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center hover:bg-muted/50 h-full"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                      <Plus className="h-6 w-6 text-spawblue" />
                    </div>
                    <p className="text-sm font-medium">Añadir Mascota</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Notas o indicaciones especiales</Label>
                    <Input
                      id="notes"
                      placeholder="Alergias, requerimientos especiales, etc."
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h2 className="text-lg font-medium mb-4">Servicios adicionales</h2>
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {addOnServices.slice(0, 4).map((service) => (
                      <AddonServiceItem
                        key={service.id}
                        service={service}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleContinue}
                    className="bg-spawblue hover:bg-spawblue-dark flex items-center gap-2"
                    disabled={!petName}
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
                    <p className="font-medium">{petName || "No seleccionada"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tamaño</h3>
                    <p className="font-medium">{petInfo.size}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tipo de Pelaje</h3>
                    <p className="font-medium">{petInfo.coat}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Precio Total</h3>
                    <p className="text-2xl font-bold">{getTotalPrice()} €</p>
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

export default SelectPet;
