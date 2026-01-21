
import { Outlet } from "react-router-dom";
import { WebsiteNavbar } from "./WebsiteNavbar";
import { WebsiteFooter } from "./WebsiteFooter";
import { MessageCircle } from "lucide-react";

export const WebsiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <WebsiteNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <WebsiteFooter />
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/918767160868" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-in zoom-in slide-in-from-bottom-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
        <MessageCircle size={28} fill="white" className="relative z-10" />
      </a>
    </div>
  );
};
