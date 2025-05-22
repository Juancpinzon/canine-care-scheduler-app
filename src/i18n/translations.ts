
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  en: {
    // General
    "appName": "Q4PAWS GROOMING",
    "back": "Back",
    "next": "Continue",
    "select": "Select",
    "continue": "Continue",
    "confirm": "Confirm",
    "optional": "optional",
    "description": "Description",
    "minutes": "minutes",
    "language": "en",
    
    // Navigation
    "login": "Log In",
    "register": "Sign Up",
    "home": "Home",
    "services": "Services",
    "myAccount": "My Account",
    
    // Booking Steps
    "step1": "Service",
    "step2": "Pet",
    "step3": "Date & Time",
    "step4": "Payment",
    
    // Service Selection
    "selectService": "Select a Service",
    "fullGroom": "Full Groom",
    "miniGroom": "Mini Groom",
    "luxuryBath": "Luxury Bath",
    "walkIn": "Walk-In Services",
    "addOn": "Add-On Services",
    "from": "From",
    "service_not_found": "Service not found",
    "approximate_duration": "Approximate duration",
    "base_price": "Base price",
    "customize_for_your_pet": "Customize for your pet",
    "price_depends_on_size": "The final price will depend on the size and coat type of your pet.",
    "dog_size": "Dog size",
    "coat_type": "Coat type",
    "flat_coat_description": "Short and smooth coat (Labrador, Beagle)",
    "coiled_coat_description": "Curly or wavy coat (Poodle, Bichon)",
    "double_coat_description": "Double coat (German Shepherd, Husky)",
    "calculated_price": "Calculated price",
    "information_saved": "Information saved",
    "continue_selecting_pet": "Continue by selecting or registering your pet",
    
    // Pet Selection
    "selectPet": "Select Your Pet",
    "yourPet": "Your Pet",
    "addPet": "Add Pet",
    "petName": "Pet Name",
    "notes": "Notes or Special Instructions",
    "notesPlaceholder": "Allergies, special requirements, etc.",
    "additionalServices": "Additional Services",
    "petSize": "Size",
    "coatType": "Coat Type",
    
    // Date and Time
    "selectDateTime": "Select Date and Time",
    "selectDate": "Select a Date",
    "availableTimesFor": "Available times for",
    "preferredGroomer": "Preferred Groomer",
    "anyAvailable": "Any Available",
    "noTimesAvailable": "No times available for this date. Please select another date.",
    
    // Checkout
    "paymentAndConfirmation": "Payment and Confirmation",
    "paymentInfo": "Payment Information",
    "firstName": "First Name",
    "lastName": "Last Name",
    "email": "Email",
    "phone": "Phone",
    "paymentMethod": "Payment Method",
    "cardNumber": "Card Number",
    "expiryDate": "Expiry Date",
    "cvv": "CVV",
    "confirmAndPay": "Confirm and Pay",
    "processing": "Processing...",
    
    // Summary
    "summary": "Summary",
    "service": "Service",
    "pet": "Pet",
    "date": "Date",
    "time": "Time",
    "groomer": "Groomer",
    "totalPrice": "Total Price",
    "subtotal": "Subtotal",
    "tax": "Tax (21%)",
    "total": "Total",
    
    // Success
    "bookingConfirmed": "Booking Confirmed!",
    "bookingConfirmedDesc": "Your appointment has been successfully scheduled. We've sent a confirmation email with all the details.",
    "newBooking": "Make New Booking",
    
    // Footer
    "quickLinks": "Quick Links",
    "contact": "Contact",
    "allRightsReserved": "All rights reserved."
  },
  es: {
    // General
    "appName": "Q4PAWS GROOMING",
    "back": "Volver",
    "next": "Continuar",
    "select": "Seleccionar",
    "continue": "Continuar",
    "confirm": "Confirmar",
    "optional": "opcional",
    "description": "Descripción",
    "minutes": "minutos",
    "language": "es",
    
    // Navigation
    "login": "Iniciar Sesión",
    "register": "Registrarse",
    "home": "Inicio",
    "services": "Servicios",
    "myAccount": "Mi Cuenta",
    
    // Booking Steps
    "step1": "Servicio",
    "step2": "Mascota",
    "step3": "Fecha y hora",
    "step4": "Pago",
    
    // Service Selection
    "selectService": "Selecciona un Servicio",
    "fullGroom": "Peluquería Completa",
    "miniGroom": "Mini Peluquería",
    "luxuryBath": "Baño de Lujo",
    "walkIn": "Servicios sin Cita",
    "addOn": "Servicios Adicionales",
    "from": "Desde",
    "service_not_found": "Servicio no encontrado",
    "approximate_duration": "Duración aproximada",
    "base_price": "Precio base",
    "customize_for_your_pet": "Personaliza para tu mascota",
    "price_depends_on_size": "El precio final dependerá del tamaño y tipo de pelaje de tu mascota.",
    "dog_size": "Tamaño del perro",
    "coat_type": "Tipo de pelaje",
    "flat_coat_description": "Pelo corto y liso (Labrador, Beagle)",
    "coiled_coat_description": "Pelo rizado o con ondas (Caniche, Bichón)",
    "double_coat_description": "Doble capa de pelo (Pastor Alemán, Husky)",
    "calculated_price": "Precio calculado",
    "information_saved": "Información guardada",
    "continue_selecting_pet": "Continúa eligiendo o registrando tu mascota",
    
    // Pet Selection
    "selectPet": "Selecciona tu Mascota",
    "yourPet": "Tu mascota",
    "addPet": "Añadir Mascota",
    "petName": "Nombre de la mascota",
    "notes": "Notas o indicaciones especiales",
    "notesPlaceholder": "Alergias, requerimientos especiales, etc.",
    "additionalServices": "Servicios adicionales",
    "petSize": "Tamaño",
    "coatType": "Tipo de Pelaje",
    
    // Date and Time
    "selectDateTime": "Selecciona Fecha y Hora",
    "selectDate": "Selecciona una fecha",
    "availableTimesFor": "Horarios disponibles para el",
    "preferredGroomer": "Peluquero preferido",
    "anyAvailable": "Cualquiera disponible",
    "noTimesAvailable": "No hay horarios disponibles para esta fecha. Por favor, selecciona otra fecha.",
    
    // Checkout
    "paymentAndConfirmation": "Pago y Confirmación",
    "paymentInfo": "Información de Pago",
    "firstName": "Nombre",
    "lastName": "Apellidos",
    "email": "Email",
    "phone": "Teléfono",
    "paymentMethod": "Método de Pago",
    "cardNumber": "Número de tarjeta",
    "expiryDate": "Fecha expiración",
    "cvv": "CVV",
    "confirmAndPay": "Confirmar y Pagar",
    "processing": "Procesando...",
    
    // Summary
    "summary": "Resumen",
    "service": "Servicio",
    "pet": "Mascota",
    "date": "Fecha",
    "time": "Hora",
    "groomer": "Peluquero",
    "totalPrice": "Precio Total",
    "subtotal": "Subtotal",
    "tax": "IVA (21%)",
    "total": "Total",
    
    // Success
    "bookingConfirmed": "¡Reserva Confirmada!",
    "bookingConfirmedDesc": "Tu cita ha sido programada correctamente. Hemos enviado un email de confirmación con todos los detalles.",
    "newBooking": "Hacer nueva reserva",
    
    // Footer
    "quickLinks": "Enlaces Rápidos",
    "contact": "Contacto",
    "allRightsReserved": "Todos los derechos reservados."
  }
};
