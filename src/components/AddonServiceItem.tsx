
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { useServiceStore } from '@/stores/useServiceStore';
import { Service } from '@/data/services';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddonServiceItemProps {
  service: Service;
}

const AddonServiceItem = ({ service }: AddonServiceItemProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const toggleAddOn = useServiceStore(state => state.toggleAddOn);
  const { t } = useLanguage();

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    toggleAddOn(service.id, service.name, checked);
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`addon-${service.id}`} 
          checked={isChecked}
          onCheckedChange={handleChange}
          className="mt-1"
        />
        <div>
          <label 
            htmlFor={`addon-${service.id}`} 
            className="text-sm font-medium cursor-pointer"
          >
            {service.name}
          </label>
          <p className="text-xs text-muted-foreground">{service.description}</p>
        </div>
      </div>
      <div className="text-sm font-semibold">
        ${service.basePrice}
        {service.name === 'De-Matting' || service.name === 'Hand Scissoring' ? 
          <span className="text-xs text-muted-foreground">/min</span> : null
        }
      </div>
    </div>
  );
};

export default AddonServiceItem;
