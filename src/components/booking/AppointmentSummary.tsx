
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface Groomer {
  id: number;
  name: string;
}

interface AppointmentSummaryProps {
  serviceName: string;
  petName: string;
  petSize: string;
  petCoat: string;
  date?: Date;
  timeSlot?: string;
  groomer: string;
  groomers: Groomer[];
  totalPrice: number;
}

const AppointmentSummary = ({ 
  serviceName, 
  petName, 
  petSize, 
  petCoat, 
  date, 
  timeSlot, 
  groomer, 
  groomers,
  totalPrice
}: AppointmentSummaryProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-lg font-medium mb-4">Resumen</div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Servicio</h3>
            <p className="font-medium">{serviceName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Mascota</h3>
            <p className="font-medium">{petName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Tamaño</h3>
            <p className="font-medium">{petSize}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Tipo de Pelaje</h3>
            <p className="font-medium">{petCoat}</p>
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
            <p className="text-2xl font-bold">${totalPrice}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentSummary;
