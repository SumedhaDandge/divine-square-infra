
import { useState } from "react";
import { Calendar, MapPin, User, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";

export default function BookSiteVisitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
      name: "",
      mobile: "",
      date: "",
      time: "",
      location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const payload = {
            name: formData.name,
            mobile: formData.mobile,
            message: `Site Visit Requested. Date: ${formData.date}, Time: ${formData.time}, Location: ${formData.location}`,
            source: "website_site_visit"
        };
        
        const res = await divineSquareService.createInquiry(payload);
        if (res.status === 201 || res.statusCode === 201) {
            setSubmitted(true);
        } else {
             toast.error("Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to request site visit.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg text-center border border-emerald-100">
           <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle2 size={40} className="text-emerald-600" />
           </div>
           <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Confirmed!</h2>
           <p className="text-gray-600 mb-8 text-lg">
             Thank you for your interest. Our team will call you shortly to confirm the pickup location and time.
           </p>
           <button onClick={() => window.location.href='/'} className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all">
             Back to Home
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50 overflow-hidden relative">
      <div className="container px-4 relative z-10 max-w-6xl mx-auto">
         <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
             {/* Left: Content */}
             <div className="space-y-8">
                 <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-widest">
                    Free Pick-up & Drop Service
                 </span>
                 <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                    Experience it <br/>
                    <span className="text-emerald-600">Before You Invest.</span>
                 </h1>
                 <p className="text-xl text-gray-600 max-w-lg">
                    Seeing is believing. Schedule a free VIP site visit to any of our projects. We'll pick you up, show you around, and drop you back.
                 </p>
                 
                 <div className="flex flex-col gap-6 pt-6 border-t border-gray-200">
                     {[
                         { title: "Expert Guidance", desc: "Our property experts will accompany you to answer all technical questions." },
                         { title: "See Development", desc: "Inspect road quality, amenities, and actual plot demarcations." },
                         { title: "No Obligation", desc: "The visit is completely free with no pressure to buy." }
                     ].map((item, i) => (
                         <div key={i} className="flex gap-4">
                             <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                 <CheckCircle2 className="text-emerald-500" size={20} />
                             </div>
                             <div>
                                 <h3 className="font-bold text-gray-900">{item.title}</h3>
                                 <p className="text-sm text-gray-500">{item.desc}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Right: Form */}
             <div className="relative">
                 <div className="absolute inset-0 bg-emerald-500/10 transform rotate-6 rounded-3xl" />
                 <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl relative border border-gray-100">
                     <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                         <Calendar className="text-emerald-500" />
                         Schedule Your Visit
                     </h3>
                     
                     <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-700">Full Name</label>
                             <div className="relative">
                                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                 <input 
                                    required 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium" 
                                    placeholder="Enter your name" 
                                 />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-700">Phone Number</label>
                             <div className="relative">
                                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                 <input 
                                    required 
                                    type="tel" 
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium" 
                                    placeholder="+91 98765..." 
                                 />
                             </div>
                         </div>

                         <div className="grid md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                 <label className="text-sm font-bold text-gray-700">Preferred Date</label>
                                 <div className="relative">
                                     <input 
                                        required 
                                        type="date" 
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium text-gray-600" 
                                     />
                                 </div>
                             </div>
                             <div className="space-y-2">
                                  <label className="text-sm font-bold text-gray-700">Preferred Time</label>
                                  <div className="relative">
                                      <input 
                                        required 
                                        type="time" 
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium text-gray-600" 
                                      />
                                  </div>
                              </div>
                         </div>

                         <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-700">Pickup Location (Optional)</label>
                             <div className="relative">
                                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                 <input 
                                    type="text" 
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium" 
                                    placeholder="Enter landmark or address" 
                                 />
                             </div>
                         </div>

                         <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                             {isSubmitting ? "Booking..." : "Confirm Booking"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                         </button>

                         <p className="text-center text-xs text-gray-400">
                             By booking, you agree to receive updates on WhatsApp.
                         </p>
                     </form>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
