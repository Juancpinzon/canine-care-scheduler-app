
import { create } from 'zustand';
import { getPriceByPetAttributes } from '@/data/services';

export type DogSize = 'Small' | 'Medium' | 'Large' | 'XL' | 'XXL';
export type CoatType = 'Flat' | 'Coiled' | 'Double';

interface ServiceSelection {
  serviceId: number;
  name: string;
  price: number;
}

interface PetInfo {
  name?: string;
  size: DogSize;
  coat: CoatType;
}

interface AppointmentInfo {
  date?: Date;
  timeSlot?: string;
  groomerId?: number;
}

interface ServiceState {
  primaryService: ServiceSelection | null;
  addOns: ServiceSelection[];
  petInfo: PetInfo;
  appointment: AppointmentInfo;
  setPrimaryService: (serviceId: number, name: string) => void;
  toggleAddOn: (serviceId: number, name: string, isSelected: boolean) => void;
  setPetInfo: (info: PetInfo) => void;
  setAppointmentInfo: (info: AppointmentInfo) => void;
  resetSelections: () => void;
  getTotalPrice: () => number;
}

// Create the store with Zustand
export const useServiceStore = create<ServiceState>((set, get) => ({
  primaryService: null,
  addOns: [],
  petInfo: {
    size: 'Medium',
    coat: 'Flat',
  },
  appointment: {},

  setPrimaryService: (serviceId, name) => {
    const { petInfo } = get();
    const price = getPriceByPetAttributes(serviceId, petInfo.size, petInfo.coat);
    
    set({
      primaryService: {
        serviceId,
        name,
        price,
      }
    });
  },

  toggleAddOn: (serviceId, name, isSelected) => {
    const { addOns, petInfo } = get();
    
    if (isSelected) {
      const price = getPriceByPetAttributes(serviceId, petInfo.size, petInfo.coat);
      set({
        addOns: [...addOns, { serviceId, name, price }]
      });
    } else {
      set({
        addOns: addOns.filter(addon => addon.serviceId !== serviceId)
      });
    }
  },

  setPetInfo: (info) => {
    const { primaryService } = get();
    
    // Recalculate prices based on new pet info
    let updatedPrimaryService = primaryService;
    if (primaryService) {
      const price = getPriceByPetAttributes(primaryService.serviceId, info.size, info.coat);
      updatedPrimaryService = { ...primaryService, price };
    }
    
    set({
      petInfo: info,
      primaryService: updatedPrimaryService
    });
  },

  setAppointmentInfo: (info) => {
    set({
      appointment: { ...get().appointment, ...info }
    });
  },

  resetSelections: () => {
    set({
      primaryService: null,
      addOns: [],
      petInfo: {
        size: 'Medium',
        coat: 'Flat',
      },
      appointment: {}
    });
  },

  getTotalPrice: () => {
    const { primaryService, addOns } = get();
    const primaryPrice = primaryService?.price || 0;
    const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
    return primaryPrice + addOnsTotal;
  }
}));
