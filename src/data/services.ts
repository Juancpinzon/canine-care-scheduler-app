export interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  serviceType: 'Full Groom' | 'Minigroom' | 'Luxury Bath' | 'Walk-In' | 'Add-On';
  durationMinutes: number;
  image?: string;
}

export interface PriceBySize {
  size: 'Small' | 'Medium' | 'Large' | 'XL' | 'XXL';
  coat: 'Flat' | 'Coiled' | 'Double';
  price: number;
}

export const services: Service[] = [
  {
    id: 1,
    name: "Full Groom",
    description: "Incluye baño con champú y acondicionador especial, secado, cepillado completo, corte de uñas, limpieza de oídos, corte de pelo según raza o preferencia.",
    basePrice: 50,
    serviceType: "Full Groom",
    durationMinutes: 120,
    image: "/lovable-uploads/e92913c6-6cc2-4e08-9dbb-3b6d712b7a05.png"
  },
  {
    id: 2,
    name: "Minigroom",
    description: "Incluye baño con champú, secado, cepillado, corte de uñas y limpieza de oídos. No incluye corte de pelo.",
    basePrice: 35,
    serviceType: "Minigroom",
    durationMinutes: 60,
    image: "/lovable-uploads/e92913c6-6cc2-4e08-9dbb-3b6d712b7a05.png"
  },
  {
    id: 3,
    name: "Luxury Bath",
    description: "Baño de lujo con productos premium, tratamiento hidratante para la piel, aromaterapia y masaje relajante.",
    basePrice: 40,
    serviceType: "Luxury Bath",
    durationMinutes: 90,
    image: "/lovable-uploads/e92913c6-6cc2-4e08-9dbb-3b6d712b7a05.png"
  }
];

export const addOnServices: Service[] = [
  {
    id: 4,
    name: "Nail Grinding",
    description: "Limado de uñas para un acabado suave",
    basePrice: 20,
    serviceType: "Add-On",
    durationMinutes: 15
  },
  {
    id: 5,
    name: "Face or Paw Trim",
    description: "Recorte detallado de pelo en cara o patas",
    basePrice: 10,
    serviceType: "Add-On",
    durationMinutes: 20
  },
  {
    id: 6,
    name: "Ear Pluck & Clean",
    description: "Limpieza profunda y depilado de orejas",
    basePrice: 5,
    serviceType: "Add-On",
    durationMinutes: 15
  },
  {
    id: 7,
    name: "De-Matting",
    description: "Tratamiento especial para eliminar nudos",
    basePrice: 25,
    serviceType: "Add-On",
    durationMinutes: 30
  },
  {
    id: 8,
    name: "Hand Scissoring",
    description: "Corte a tijera manual para un acabado perfecto",
    basePrice: 35,
    serviceType: "Add-On",
    durationMinutes: 45
  },
  {
    id: 9,
    name: "Express Groom",
    description: "Servicio prioritario sin tiempo de espera",
    basePrice: 25,
    serviceType: "Add-On",
    durationMinutes: 0
  }
];

// Pricing matrix by dog size and coat type
export const pricingMatrix: Record<number, PriceBySize[]> = {
  // Full Groom pricing (service id: 1)
  1: [
    { size: "Small", coat: "Flat", price: 50 },
    { size: "Small", coat: "Coiled", price: 60 },
    { size: "Small", coat: "Double", price: 65 },
    { size: "Medium", coat: "Flat", price: 65 },
    { size: "Medium", coat: "Coiled", price: 75 },
    { size: "Medium", coat: "Double", price: 85 },
    { size: "Large", coat: "Flat", price: 80 },
    { size: "Large", coat: "Coiled", price: 90 },
    { size: "Large", coat: "Double", price: 100 },
    { size: "XL", coat: "Flat", price: 95 },
    { size: "XL", coat: "Coiled", price: 110 },
    { size: "XL", coat: "Double", price: 125 },
    { size: "XXL", coat: "Flat", price: 110 },
    { size: "XXL", coat: "Coiled", price: 130 },
    { size: "XXL", coat: "Double", price: 150 }
  ],
  // Minigroom pricing (service id: 2)
  2: [
    { size: "Small", coat: "Flat", price: 35 },
    { size: "Small", coat: "Coiled", price: 40 },
    { size: "Small", coat: "Double", price: 45 },
    { size: "Medium", coat: "Flat", price: 45 },
    { size: "Medium", coat: "Coiled", price: 50 },
    { size: "Medium", coat: "Double", price: 55 },
    { size: "Large", coat: "Flat", price: 55 },
    { size: "Large", coat: "Coiled", price: 60 },
    { size: "Large", coat: "Double", price: 70 },
    { size: "XL", coat: "Flat", price: 65 },
    { size: "XL", coat: "Coiled", price: 75 },
    { size: "XL", coat: "Double", price: 85 },
    { size: "XXL", coat: "Flat", price: 80 },
    { size: "XXL", coat: "Coiled", price: 90 },
    { size: "XXL", coat: "Double", price: 100 }
  ],
  // Luxury Bath pricing (service id: 3)
  3: [
    { size: "Small", coat: "Flat", price: 40 },
    { size: "Small", coat: "Coiled", price: 45 },
    { size: "Small", coat: "Double", price: 50 },
    { size: "Medium", coat: "Flat", price: 50 },
    { size: "Medium", coat: "Coiled", price: 55 },
    { size: "Medium", coat: "Double", price: 60 },
    { size: "Large", coat: "Flat", price: 60 },
    { size: "Large", coat: "Coiled", price: 65 },
    { size: "Large", coat: "Double", price: 70 },
    { size: "XL", coat: "Flat", price: 70 },
    { size: "XL", coat: "Coiled", price: 80 },
    { size: "XL", coat: "Double", price: 90 },
    { size: "XXL", coat: "Flat", price: 85 },
    { size: "XXL", coat: "Coiled", price: 95 },
    { size: "XXL", coat: "Double", price: 105 }
  ]
};

export const getPriceByPetAttributes = (serviceId: number, size: 'Small' | 'Medium' | 'Large' | 'XL' | 'XXL', coat: 'Flat' | 'Coiled' | 'Double'): number => {
  if (!pricingMatrix[serviceId]) {
    const service = [...services, ...addOnServices].find(s => s.id === serviceId);
    return service ? service.basePrice : 0;
  }

  const price = pricingMatrix[serviceId].find(p => p.size === size && p.coat === coat);
  return price ? price.price : 0;
};
