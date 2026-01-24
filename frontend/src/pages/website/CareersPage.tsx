
import { Briefcase, ArrowRight, UserCheck, TrendingUp, Award, PhoneCall, Building2, Users, Rocket, ExternalLink, MessageCircle } from "lucide-react";
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
                "transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1)",
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]",
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default function CareersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-emerald-500/30 selection:text-emerald-900">
        
        {/* --- 1. CLEAN HERO SECTION --- */}
        <div className="bg-emerald-950 pt-40 pb-24 relative overflow-hidden">
             {/* Abstract Background */}
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

             <div className="container px-4 relative z-10">
                <Reveal>
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                            We Are Hiring
                        </span>
                        <h1 className="text-5xl md:text-7xl font-sans font-bold text-white mb-8 tracking-tight leading-[1.1]">
                            Join the Force <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400">Building Nagpur's Future.</span>
                        </h1>
                        <p className="text-xl text-emerald-100/70 max-w-2xl font-light leading-relaxed">
                            At Divine Square, we don't just sell plots; we build legacies. Join a high-performance team that values integrity, growth, and results.
                        </p>
                    </div>
                </Reveal>
             </div>
        </div>

        {/* --- 2. SPLIT LAYOUT: CULTURE & JOBS --- */}
        <div className="py-24 bg-stone-50">
            <div className="container px-4">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* LEFT: WHY CHOOSE US (Sticky on Desktop) */}
                    <div className="lg:col-span-4 self-start lg:sticky lg:top-32">
                        <Reveal>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Divine Square?</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                We provide an environment where your ambition meets opportunity. Join a team that values growth, transparency, and rewards performance.
                            </p>
                            
                            <div className="space-y-6">
                                {[
                                    { icon: Rocket, title: "Accelerated Growth", desc: "Direct mentorship from industry leaders." },
                                    { icon: TrendingUp, title: "Uncapped Earnings", desc: "Best-in-industry commission structures." },
                                    { icon: Users, title: "Vibrant Culture", desc: "We celebrate every small win together." },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* HR Contact Box */}
                            <div className="mt-10 p-6 bg-emerald-950 text-white rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                                <h4 className="font-bold mb-2 relative z-10">Have questions?</h4>
                                <p className="text-emerald-100/70 text-sm mb-4 relative z-10">Chat directly with our HR team.</p>
                                <a href="https://wa.me/918767160868" className="inline-flex items-center gap-2 text-emerald-300 font-bold text-sm hover:text-white transition-colors relative z-10">
                                    <MessageCircle size={16} /> Chat on WhatsApp
                                </a>
                            </div>
                        </Reveal>
                    </div>

                    {/* RIGHT: OPEN POSITIONS */}
                    <div className="lg:col-span-8">
                        <Reveal>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">Current Openings</h2>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">4 Positions</span>
                            </div>
                        
                        <div className="space-y-4">
                                {[
                                    { role: "Business Development Executive", type: "Full-Time", money: "Best in Industry", exp: "Freshers & Experienced" },
                                    { role: "Sales Executive", type: "Full-Time", money: "Best in Industry", exp: "Freshers & Experienced" },
                                    { role: "Real Estate Consultant", type: "Freelance", money: "Best in Industry", exp: "Freshers & Experienced" },
                                    { role: "Tele-Caller", type: "Full-Time", money: "Best in Industry", exp: "Freshers & Experienced" }
                                ].map((job, i) => (
                                    <Reveal key={i} delay={i * 100}>
                                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all duration-300 group">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">{job.role}</h3>
                                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 font-medium mb-4">
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100"><Briefcase size={12} /> {job.type}</span>
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100"><Award size={12} /> {job.money}</span>
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100"><UserCheck size={12} /> {job.exp}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-1">
                                                        Join our dynamic sales team and help us expand our footprint in premium locations.
                                                    </p>
                                                </div>
                                                <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                                     <a href="tel:+918767160868" className="px-5 py-2 rounded-lg border border-gray-200 hover:border-emerald-600 hover:text-emerald-600 font-bold text-sm transition-all text-center">
                                                        Call
                                                     </a>
                                                     <a href="https://wa.me/918767160868?text=I am interested in applying for a job." target="_blank" className="px-5 py-2 rounded-lg bg-gray-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                                                        Apply <ArrowRight size={14} />
                                                     </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </Reveal>

                        {/* --- SIMPLE BOTTOM CTA (Inside Right Column) --- */}
                        <Reveal className="mt-12">
                            <div className="bg-stone-200 rounded-3xl p-8 text-center relative overflow-hidden">
                                <h3 className="text-lg font-bold text-stone-700 mb-2">Don't see a role for you?</h3>
                                <p className="text-stone-500 text-sm mb-6">
                                    We are always looking for talent. Send us your resume today.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <a href="mailto:careers@divinesquare.com" className="inline-flex items-center gap-2 text-stone-800 font-bold hover:text-emerald-600 transition-colors bg-white px-5 py-2 rounded-full shadow-sm text-sm">
                                        <ExternalLink size={14} /> Email Resume
                                    </a>
                                    <a href="https://wa.me/918767160868" className="inline-flex items-center gap-2 text-stone-800 font-bold hover:text-emerald-600 transition-colors bg-white px-5 py-2 rounded-full shadow-sm text-sm">
                                        <MessageCircle size={14} /> WhatsApp Resume
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
}
