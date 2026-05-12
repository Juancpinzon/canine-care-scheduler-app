
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
import Horarios from "./pages/admin/Horarios";
import Reports from "./pages/admin/Reports";
import AdminLayout from "./components/admin/AdminLayout";
import Reservar from "./pages/public/Reservar";
import Registro from "./pages/Registro";
import MisCitas from "./pages/client/MisCitas";
import MisPerros from "./pages/client/MisPerros";
import Perfil from "./pages/client/Perfil";
import Servicios from "./pages/admin/Servicios";
import AdminGaleria from "./pages/admin/Galeria";
import Calendario from "./pages/admin/Calendario";
import Citas from "./pages/admin/Citas";
import Clientes from "./pages/admin/Clientes";
import Mascotas from "./pages/admin/Mascotas";

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
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/calendario" element={<AdminLayout><Calendario /></AdminLayout>} />
            <Route path="/admin/citas" element={<AdminLayout><Citas /></AdminLayout>} />
            <Route path="/admin/clientes" element={<AdminLayout><Clientes /></AdminLayout>} />
            <Route path="/admin/mascotas" element={<AdminLayout><Mascotas /></AdminLayout>} />
            <Route path="/admin/horarios" element={<AdminLayout><Horarios /></AdminLayout>} />
            <Route path="/admin/reportes" element={<AdminLayout><Reports /></AdminLayout>} />
            <Route path="/admin/servicios" element={<AdminLayout><Servicios /></AdminLayout>} />
            <Route path="/admin/galeria" element={<AdminLayout><AdminGaleria /></AdminLayout>} />
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
