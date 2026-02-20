import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from '@tanstack/react-router';
import CartButton from './CartButton';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate({ to: '/' });
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Products', id: 'products' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-soft border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-2xl font-serif font-semibold text-foreground hover:text-primary transition-colors"
          >
            ShopIndex
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all text-foreground/80 hover:text-primary hover:bg-muted"
              >
                {link.label}
              </button>
            ))}
            {identity && (
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/order-tracking' })}
                className="text-sm font-medium"
              >
                Orders
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/admin/dashboard' })}
                className="text-sm font-medium"
              >
                Admin
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <CartButton />
            <LoginButton />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-3 text-left text-base font-medium rounded-md transition-all text-foreground/80 hover:text-primary hover:bg-muted"
                >
                  {link.label}
                </button>
              ))}
              {identity && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate({ to: '/order-tracking' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  Orders
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate({ to: '/admin/dashboard' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  Admin
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
