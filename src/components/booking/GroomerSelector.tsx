
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';

interface Groomer {
  id: number;
  name: string;
}

interface GroomerSelectorProps {
  groomers: Groomer[];
  selectedGroomer: string;
  onGroomerChange: (groomerId: string) => void;
}

const GroomerSelector = ({ groomers, selectedGroomer, onGroomerChange }: GroomerSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">{t('preferredGroomer')}</h2>
      <Select value={selectedGroomer} onValueChange={onGroomerChange}>
        <SelectTrigger className="w-full mb-6">
          <SelectValue placeholder={`${t('preferredGroomer')} (${t('optional')})`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">{t('anyAvailable')}</SelectItem>
          {groomers.map((g) => (
            <SelectItem key={g.id} value={g.id.toString()}>
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroomerSelector;
