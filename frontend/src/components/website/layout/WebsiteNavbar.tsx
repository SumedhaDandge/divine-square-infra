
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const WebsiteNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Determine if we are on a page that supports a transparent header
  const isTransparentPage = location.pathname === '/';
  
  // Logic: 
  // If NOT on transparent page -> Always solid background, primary text
  // If ON transparent page -> Transparent at top (white text), Solid when scrolled (primary text)

  const isScrolledOrNotTransparent = scrolled || !isTransparentPage;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects-public" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
          isScrolledOrNotTransparent
            ? "bg-white/90 backdrop-blur-md border-gray-200 py-3 shadow-sm" 
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
               <div className={cn(
                   "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 shadow-sm",
                   isScrolledOrNotTransparent ? "bg-primary text-white" : "bg-white/10 backdrop-blur-md text-white border border-white/20"
               )}>
                  DS
               </div>
               <div className="flex flex-col">
                  <span className={cn(
                      "font-bold text-xl leading-none tracking-tight transition-colors", 
                      isScrolledOrNotTransparent ? "text-gray-900" : "text-white"
                  )}>
                    Divine Square
                  </span>
                  <span className={cn(
                      "text-[10px] tracking-[0.2em] uppercase font-semibold mt-1 transition-colors", 
                      isScrolledOrNotTransparent ? "text-primary" : "text-white/80"
                  )}>
                    Infra
                  </span>
               </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className={cn(
                  "flex items-center gap-1 rounded-full p-1 border transition-all duration-300",
                  isScrolledOrNotTransparent ? "bg-white border-gray-100 shadow-sm" : "bg-secondary/30 backdrop-blur-md border-white/20"
              )}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300",
                        location.pathname === link.path 
                          ? isScrolledOrNotTransparent ? "bg-primary text-white shadow-md" : "bg-white text-primary shadow-sm font-bold"
                          : isScrolledOrNotTransparent 
                              ? "text-gray-600 hover:bg-gray-100 hover:text-primary" 
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
              </div>

              <div className="flex items-center gap-4">
                  <button 
                      onClick={() => navigate('/contact')}
                      className={cn(
                          "hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md",
                          isScrolledOrNotTransparent 
                            ? "bg-primary text-white hover:bg-primary-hover shadow-primary/20" 
                            : "bg-white text-primary hover:bg-white/90"
                      )}
                  >
                      <Calendar size={16} />
                      Book Visit
                  </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                  "md:hidden p-2 rounded-xl transition-colors",
                  isScrolledOrNotTransparent ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
              )}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
          "fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col pt-32 px-6",
          isOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-10"
      )}>
          <div className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "p-4 rounded-xl text-2xl font-bold transition-all duration-300 border border-transparent",
                  location.pathname === link.path
                    ? "bg-primary/5 text-primary border-primary/10 pl-6"
                    : "text-gray-500 hover:text-gray-900 hover:pl-6"
                )}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-8">
              <button 
                  onClick={() => { navigate('/contact'); setIsOpen(false); }}
                  className="w-full bg-primary text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                  <Calendar size={20} /> Book Visit
              </button>
          </div>
      </div>
    </>
  );
};
