
import { Mail, MapPin, Phone, Send, Clock, MessageSquare, ArrowRight, User, MousePointerClick } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

// Reveal Component
const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={cn(
                "transition-all duration-700 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background overflow-hidden px-4 md:px-0">
      
      {/* CLEAN HEADER - Solid Color block with clean visuals */}
      <div className="bg-primary relative py-20 rounded-b-[2.5rem] md:rounded-b-[4rem] mb-12 shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
         
         <div className="container px-4 text-center relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 mb-6 backdrop-blur-md">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-xs font-bold tracking-widest uppercase">We are here to help</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">Let's Discuss Your Future</h1>
              <p className="text-white/80 max-w-xl mx-auto text-lg md:text-xl font-light leading-relaxed">
                Have questions about our projects or want to schedule a site visit? Reach out to us today.
              </p>
            </Reveal>
        </div>
      </div>

      <div className="container px-4 relative z-10 -mt-20">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
           {[
               { icon: <Phone size={24}/>, title: "Call Us", desc: "Mon-Sat from 10am to 7pm", action: "+91 8767160868", link: "tel:+918767160868" },
               { icon: <Mail size={24}/>, title: "Email Us", desc: "We'll respond within 24 hours", action: "info@divinesquare.com", link: "mailto:info@divinesquare.com" },
               { icon: <MapPin size={24}/>, title: "Headquarters", desc: "Wardha Road, Nagpur", action: "Get Directions", link: "#" }
           ].map((item, i) => (
             <Reveal key={i} delay={i * 100} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 mb-6 text-sm">{item.desc}</p>
                <a href={item.link} className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm uppercase tracking-wide">
                    {item.action} <ArrowRight size={14} />
                </a>
             </Reveal>
           ))}
        </div>

        {/* Clean Form & Map Section */}
        <Reveal delay={300} className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
           <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Send us a Message</h2>
              <p className="text-gray-500 mb-10">Fill out the form below and our team will get back to you shortly.</p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                           <User size={14} /> First Name
                        </label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium outline-none text-gray-900" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                           <User size={14} /> Last Name
                        </label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium outline-none text-gray-900" placeholder="Doe" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                       <Phone size={14} /> Phone Number
                    </label>
                    <input type="tel" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium outline-none text-gray-900" placeholder="+91 98765 43210" />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                       <MessageSquare size={14} /> Message
                    </label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium outline-none resize-none text-gray-900" placeholder="I am interested in..."></textarea>
                </div>

                <button className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group">
                    Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
           </div>
           
           <div className="bg-gray-100 lg:h-auto h-[400px] relative">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.240755918731!2d79.08815931533056!3d21.14275008593674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c08d81023a1d%3A0x679457635c916298!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
             ></iframe>
             
             {/* Simple Location Overlay */}
             <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 max-w-sm mx-auto">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                         <p className="font-bold text-gray-900 text-sm">Divine Square HQ</p>
                         <p className="text-xs text-gray-500 mt-0.5">Manish Nagar, Nagpur</p>
                     </div>
                 </div>
             </div>
           </div>
        </Reveal>
      </div>
    </div>
  );
}
