
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServiceDetails from "./pages/ServiceDetails";
import SelectPet from "./pages/SelectPet";
import SelectDateTime from "./pages/SelectDateTime";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Reservar from "./pages/public/Reservar";
import MisCitas from "./pages/client/MisCitas";
import MisPerros from "./pages/client/MisPerros";
import Perfil from "./pages/client/Perfil";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/service/:serviceType" element={<ServiceDetails />} />
            <Route path="/select-pet" element={<SelectPet />} />
            <Route path="/select-datetime" element={<SelectDateTime />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/reservar" element={<Reservar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/mis-citas" element={<MisCitas />} />
            <Route path="/mis-perros" element={<MisPerros />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
