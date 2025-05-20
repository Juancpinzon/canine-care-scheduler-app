
import { useState } from 'react';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceCard from "@/components/ServiceCard";
import AddonServiceItem from "@/components/AddonServiceItem";
import { services, addOnServices } from "@/data/services";

const Index = () => {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-spawblue mb-4">S-PAW GROOMING</h1>
          <p className="text-xl text-gray-600 mb-6">Servicios profesionales de peluquería canina</p>
          <div className="w-16 h-1 bg-spawgreen mx-auto"></div>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="grid md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 text-xs font-medium bg-spawblue/10 text-spawblue rounded-full mb-4">
                Servicio Premium
              </div>
              <h2 className="text-3xl font-bold mb-4">Cuidamos de tu mascota como si fuera nuestra</h2>
              <p className="text-gray-600 mb-6">
                Reserva una cita de peluquería para tu perro y disfruta de nuestros servicios profesionales adaptados al tamaño y tipo de pelaje de tu mascota.
              </p>
              <div className="flex gap-4">
                <a href="#servicios">
                  <Button variant="default" size="lg" className="bg-spawblue hover:bg-spawblue-dark">
                    Ver Servicios
                  </Button>
                </a>
                <Button variant="outline" size="lg">
                  Sobre Nosotros
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 min-h-[300px] flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 bg-spawblue/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <span className="text-spawblue text-4xl font-bold">DOG</span>
                </div>
                <p className="text-gray-600 italic">Imagen ilustrativa del perro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="servicios" className="scroll-mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios de peluquería canina adaptados a las necesidades específicas de tu mascota.
            </p>
          </div>

          <Tabs defaultValue="services" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="services">Servicios Principales</TabsTrigger>
              <TabsTrigger value="addons">Servicios Adicionales</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    name={service.name}
                    description={service.description}
                    basePrice={service.basePrice}
                    image={service.image}
                    type={service.serviceType}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="addons" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addOnServices.map((service) => (
                  <AddonServiceItem
                    key={service.id}
                    service={service}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pricing Info */}
        <div className="mt-16 bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Tabla de Precios</h3>
          <p className="text-gray-600 mb-4">
            Nuestros precios varían según el tamaño de tu perro y su tipo de pelaje. 
            Selecciona un servicio principal para ver los precios específicos para tu mascota.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center mb-4">
            <div className="bg-spawblue text-white p-2 rounded font-medium">Tamaño</div>
            <div className="bg-gray-100 p-2 rounded">Small</div>
            <div className="bg-gray-100 p-2 rounded">Medium</div>
            <div className="bg-gray-100 p-2 rounded">Large</div>
            <div className="bg-gray-100 p-2 rounded">XL/XXL</div>
          </div>

          <div className="bg-spawblue/10 p-4 rounded-md text-sm">
            <p className="mb-2"><strong>Información sobre tipos de pelaje:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Flat:</strong> Pelo corto y liso (Labrador, Beagle)</li>
              <li><strong>Coiled:</strong> Pelo rizado o con ondas (Caniche, Bichón)</li>
              <li><strong>Double:</strong> Doble capa de pelo (Pastor Alemán, Husky)</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para reservar?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Reserva ahora una cita para tu mascota y déjanos encargarnos de su cuidado con nuestros servicios profesionales.
          </p>
          <Button variant="default" size="lg" className="bg-spawgreen hover:bg-spawgreen-dark">
            Reservar Ahora
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
