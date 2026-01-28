
import { Mail, MapPin, Phone, Send, Clock, PhoneCall, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

// --- Components ---

const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={cn(
                "transition-all duration-1000 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// ... imports
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";

// ... inside component

export default function ContactPage() {
  const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          const payload = {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              mobile: formData.mobile,
              message: formData.message,
              source: "website"
          };
          
          const res = await divineSquareService.createInquiry(payload);
          if (res.status === 201) {
              toast.success("Message sent successfully!");
              setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  mobile: "",
                  message: ""
              });
          }
      } catch (error) {
          console.error(error);
          toast.error("Failed to send message. Please try again.");
      } finally {
          setIsSubmitting(false);
      }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center p-0 lg:p-8 relative selection:bg-emerald-500/30 selection:text-emerald-900 overflow-x-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-emerald-950 z-0 lg:rounded-b-[3rem] shadow-2xl hidden lg:block" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none hidden lg:block" />

        {/* Mobile Background */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-emerald-950 z-0 lg:hidden" />

        <div className="container relative z-10 max-w-6xl mx-auto pt-32 pb-12 px-4">
             
             {/* --- Page Header --- */}
             <Reveal className="text-center mb-12">
                 <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    Contact Us
                 </span>
                 <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    Get in Touch with Us.
                 </h1>
                 <p className="text-emerald-100/70 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                    Have questions about our projects or want to <a href="/book-visit" className="text-white font-bold underline decoration-emerald-400 hover:text-emerald-300 transition-colors">book a site visit</a>? We are always open to discussing new opportunities.
                 </p>
             </Reveal>

             <Reveal delay={200}>
                 {/* Main Unified Card */}
                 <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                     
                     {/* LEFT SIDE: Contact Information (Dark) */}
                     <div className="lg:w-[40%] bg-emerald-950 text-white p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
                         {/* Pattern Overlay */}
                         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                         <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-[80px] opacity-50 translate-x-1/3 translate-y-1/3" />
                         
                         <div className="relative z-10">
                             <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                             <p className="text-emerald-100/70 mb-10 leading-relaxed">
                                 Fill up the form and our Team will get back to you within 24 hours.
                             </p>

                             <div className="space-y-8">
                                 <div className="flex items-start gap-4">
                                     <PhoneCall className="text-emerald-400 shrink-0 mt-1" size={20} />
                                     <div>
                                         <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Phone Number</p>
                                         <a href="tel:+918767160868" className="text-lg font-medium hover:text-emerald-300 transition-colors block">+91 87671 60868</a>
                                     </div>
                                 </div>

                                 <div className="flex items-start gap-4">
                                     <Mail className="text-emerald-400 shrink-0 mt-1" size={20} />
                                     <div>
                                         <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Email Address</p>
                                         <a href="mailto:info@divinesquare.com" className="text-lg font-medium hover:text-emerald-300 transition-colors block">info@divinesquare.com</a>
                                     </div>
                                 </div>

                                 <div className="flex items-start gap-4">
                                     <MapPin className="text-emerald-400 shrink-0 mt-1" size={20} />
                                     <div>
                                         <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Office Address</p>
                                         <p className="text-lg font-medium leading-snug">Wardha Road, Nagpur, <br/> Maharashtra 440015</p>
                                     </div>
                                 </div>
                                 
                                 <div className="flex items-start gap-4">
                                     <Clock className="text-emerald-400 shrink-0 mt-1" size={20} />
                                     <div>
                                         <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Working Hours</p>
                                         <p className="text-lg font-medium">10:00 AM - 07:00 PM</p>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Socials */}
                         <div className="relative z-10 mt-12 pt-12 border-t border-emerald-900 flex gap-4">
                             {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                 <a key={i} href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                                     <Icon size={18} />
                                 </a>
                             ))}
                         </div>
                     </div>

                     {/* RIGHT SIDE: Form (Light) */}
                     <div className="lg:w-[60%] p-10 md:p-14 bg-white flex flex-col justify-center">
                         <form onSubmit={handleSubmit} className="space-y-8">
                             <div className="grid md:grid-cols-2 gap-8">
                                 <div className="group relative">
                                     <label className="text-sm font-bold text-gray-500 mb-1 block group-focus-within:text-emerald-600 transition-colors">First Name</label>
                                     <input 
                                       type="text" 
                                       name="firstName" 
                                       value={formData.firstName}
                                       onChange={handleChange}
                                       required
                                       className="w-full border-b border-gray-200 py-3 text-gray-900 font-medium focus:outline-none focus:border-emerald-600 transition-all font-serif" 
                                       placeholder="John" 
                                    />
                                 </div>
                                 <div className="group relative">
                                     <label className="text-sm font-bold text-gray-500 mb-1 block group-focus-within:text-emerald-600 transition-colors">Last Name</label>
                                     <input 
                                        type="text" 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-b border-gray-200 py-3 text-gray-900 font-medium focus:outline-none focus:border-emerald-600 transition-all font-serif" 
                                        placeholder="Doe" 
                                    />
                                 </div>
                             </div>

                             <div className="grid md:grid-cols-2 gap-8">
                                 <div className="group relative">
                                     <label className="text-sm font-bold text-gray-500 mb-1 block group-focus-within:text-emerald-600 transition-colors">Email</label>
                                     <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-200 py-3 text-gray-900 font-medium focus:outline-none focus:border-emerald-600 transition-all font-serif" 
                                        placeholder="john@example.com" 
                                    />
                                 </div>
                                 <div className="group relative">
                                     <label className="text-sm font-bold text-gray-500 mb-1 block group-focus-within:text-emerald-600 transition-colors">Phone</label>
                                     <input 
                                        type="tel" 
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-b border-gray-200 py-3 text-gray-900 font-medium focus:outline-none focus:border-emerald-600 transition-all font-serif" 
                                        placeholder="+91 00000 00000" 
                                    />
                                 </div>
                             </div>

                             <div className="group relative">
                                 <label className="text-sm font-bold text-gray-500 mb-1 block group-focus-within:text-emerald-600 transition-colors">Message</label>
                                 <textarea 
                                    rows={3} 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-200 py-3 text-gray-900 font-medium focus:outline-none focus:border-emerald-600 transition-all resize-none font-serif" 
                                    placeholder="Write your message here..."></textarea>
                             </div>

                             <div className="pt-4 flex justify-end">
                                 <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="px-12 py-4 bg-emerald-950 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                                     {isSubmitting ? "Sending..." : "Send Message"} <Send size={18} />
                                 </button>
                             </div>
                         </form>
                     </div>

                 </div>
             </Reveal>

             {/* --- Join Team Promo --- */}
             <Reveal delay={400} className="mt-12 text-center">
                 <div className="bg-emerald-50 rounded-2xl p-8 max-w-2xl mx-auto border border-emerald-100">
                     <p className="text-gray-900 font-bold text-lg mb-2">Interested in building a career with us?</p>
                     <p className="text-gray-500 mb-6 text-sm">We are always looking for passionate individuals to join our growing family.</p>
                     <a href="/careers" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/20 group">
                         Join the Divine Team <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </a>
                 </div>
             </Reveal>
        </div>
    </div>
  );
}
