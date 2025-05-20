
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useServiceStore } from '@/stores/useServiceStore';
import { toast } from "sonner";

interface ServiceCardProps {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  image?: string;
  type: 'Full Groom' | 'Minigroom' | 'Luxury Bath' | 'Walk-In' | 'Add-On';
}

const ServiceCard = ({ id, name, description, basePrice, image, type }: ServiceCardProps) => {
  const setPrimaryService = useServiceStore(state => state.setPrimaryService);

  const handleSelect = () => {
    setPrimaryService(id, name);
    toast.success(`Has seleccionado ${name}`, {
      description: "Ahora puedes continuar con tu reserva"
    });
  };

  return (
    <Card className="flex flex-col h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white font-semibold">{`Desde ${basePrice} €`}</p>
          </div>
        </div>
      )}
      <CardHeader className={!image ? "pb-2" : "pb-2 pt-4"}>
        <CardTitle className="text-xl text-spawblue">{name}</CardTitle>
        {!image && <p className="text-sm font-medium text-muted-foreground">{`Desde ${basePrice} €`}</p>}
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-foreground/80">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link to={`/service/${encodeURIComponent(type.toLowerCase().replace(' ', '-'))}`} className="w-full" onClick={handleSelect}>
          <Button variant="default" className="w-full bg-spawblue hover:bg-spawblue-dark flex items-center justify-center gap-2">
            <span>Seleccionar</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
