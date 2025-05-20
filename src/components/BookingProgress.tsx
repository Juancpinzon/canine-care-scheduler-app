
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookingProgressProps {
  currentStep: number;
}

const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  const { t } = useLanguage();
  
  const steps = [
    { number: 1, title: t("step1") },
    { number: 2, title: t("step2") },
    { number: 3, title: t("step3") },
    { number: 4, title: t("step4") }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative">
            <div 
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-10 
                ${currentStep > step.number 
                  ? 'bg-spawgreen border-spawgreen text-white' 
                  : currentStep === step.number 
                  ? 'bg-spawblue border-spawblue text-white' 
                  : 'bg-white border-gray-300 text-gray-500'}`}
            >
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            
            <p className={`text-xs mt-2 font-medium ${currentStep >= step.number ? 'text-spawblue' : 'text-gray-500'}`}>
              {step.title}
            </p>
            
            {index < steps.length - 1 && (
              <div 
                className={`absolute top-5 left-[40px] w-[calc(100%-30px)] h-[2px] 
                  ${currentStep > step.number ? 'bg-spawgreen' : 'bg-gray-300'}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;
