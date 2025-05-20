
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: "Login coming soon",
      description: "The login functionality will be implemented in a future update.",
    });
  };

  const handleRegister = () => {
    toast({
      title: "Registration coming soon",
      description: "The registration functionality will be implemented in a future update.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col dog-paw-pattern">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between py-4 px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-spawblue flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl text-spawblue hidden md:inline">S-PAW GROOMING</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleLogin}>
              Iniciar Sesión
            </Button>
            <Button variant="default" className="bg-spawblue hover:bg-spawblue-dark" onClick={handleRegister}>
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-8">
        {children}
      </main>

      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-spawblue mb-3">S-PAW GROOMING</h3>
              <p className="text-gray-600 text-sm">La mejor peluquería canina con servicios profesionales para tu mascota.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-600 hover:text-spawblue">Inicio</Link></li>
                <li><a href="#servicios" className="text-gray-600 hover:text-spawblue">Servicios</a></li>
                <li><button className="text-gray-600 hover:text-spawblue" onClick={handleLogin}>Mi Cuenta</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contacto</h3>
              <address className="not-italic text-sm text-gray-600">
                <p>Avenida de los Perros, 123</p>
                <p>28000, Madrid</p>
                <p>Tel: 91 234 56 78</p>
                <p>Email: info@spawgrooming.es</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} S-PAW GROOMING. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
