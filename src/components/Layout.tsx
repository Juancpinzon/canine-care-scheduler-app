
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const { toast } = useToast();
  const { t, LanguageToggle } = useLanguage();

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
            <img 
              src="/lovable-uploads/0656d71a-feb3-40ad-8983-d5cfee6fc324.png" 
              alt="Q4PAWS Logo" 
              className="h-10 w-auto"
            />
            <span className="font-bold text-xl text-spawblue hidden md:inline">{t('appName')}</span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button variant="ghost" onClick={handleLogin}>
              {t('login')}
            </Button>
            <Button variant="default" className="bg-spawblue hover:bg-spawblue-dark" onClick={handleRegister}>
              {t('register')}
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
              <h3 className="font-semibold text-spawblue mb-3">{t('appName')}</h3>
              <p className="text-gray-600 text-sm">{t('language') === 'en' ? 'The best dog grooming with professional services for your pet.' : 'La mejor peluquería canina con servicios profesionales para tu mascota.'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t('quickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-600 hover:text-spawblue">{t('home')}</Link></li>
                <li><a href="#servicios" className="text-gray-600 hover:text-spawblue">{t('services')}</a></li>
                <li><button className="text-gray-600 hover:text-spawblue" onClick={handleLogin}>{t('myAccount')}</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t('contact')}</h3>
              <address className="not-italic text-sm text-gray-600">
                <p>123 Canine Boulevard</p>
                <p>Kissimmee, Florida 34741</p>
                <p>Tel: (407) 123-4567</p>
                <p>Email: info@q4paws.com</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Q4PAWS GROOMING. {t('allRightsReserved')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
