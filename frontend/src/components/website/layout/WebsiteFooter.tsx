
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const WebsiteFooter = () => {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10 border-t border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-6 space-y-6">
            <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                    DS
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-2xl leading-none text-white">Divine Square</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-bold mt-1">Infra</p>
                </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Nagpur's most trusted real estate partner. We specialize in legally clear, NMRDA sanctioned, and RERA registered plots designed for your future legacy.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                  { Icon: Facebook, link: "#" },
                  { Icon: Instagram, link: "https://www.instagram.com/divinesquareinfra/" },
                  { Icon: Linkedin, link: "#" }
              ].map(({ Icon, link }, i) => (
                <a key={i} href={link} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-gray-700 shadow-sm hover:shadow-lg group">
                  <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
            {/* Attractive WhatsApp Button */}
             <a href="https://wa.me/918767160868" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 bg-[#25D366] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mt-4 group">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                   <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118 571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </div>
                Chat on WhatsApp
             </a>
          </div>

          {/* Quick Links - Centered */}
          <div className="lg:col-span-2 lg:flex lg:justify-center">
            <div>
                <h4 className="font-bold text-lg mb-6 text-white capitalize tracking-wide">Company</h4>
                <ul className="space-y-4">
                  {[
                      { name: 'Home', path: '/' },
                      { name: 'About Us', path: '/about' },
                      { name: 'Projects', path: '/projects-public' },
                      { name: 'Contact', path: '/contact' }
                  ].map((item) => (
                     <li key={item.name}>
                        <Link to={item.path} className="text-gray-400 hover:text-primary hover:pl-2 transition-all inline-block text-sm font-medium">
                            {item.name}
                        </Link>
                     </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* Careers / Team Promo - Right Side Expanded */}
          <div className="lg:col-span-4">
              <h4 className="font-bold text-lg mb-6 text-white capitalize tracking-wide">Join Our Vision</h4>
              <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
                  
                  <h5 className="text-white font-bold text-lg mb-2">Build Your Legacy</h5>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      We are always looking for visionary people who want to redefine real estate.
                  </p>
                  <Link to="/careers" className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-xl font-bold text-sm transition-all">
                      View Openings <ArrowRight size={16} />
                  </Link>
              </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Divine Square Infra. All rights reserved.</p>
          <div className="flex gap-8">
             <div className="flex items-center gap-2">
                 <Phone size={14} className="text-primary"/> +91 87671 60868
             </div>
             <div className="flex items-center gap-2">
                 <Mail size={14} className="text-primary"/> info@divinesquare.com
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
