
import { Building2, Award, Users, Target, CheckCircle2, Trophy, Clock, HeartHandshake } from "lucide-react";
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

export default function AboutPage() {
    
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background overflow-hidden px-4 md:px-0">
      
      {/* PROFESSIONAL HERO - Clean & Centered */}
      <div className="relative py-24 bg-gray-50 border-b border-gray-100">
        <div className="container relative z-10 px-4 text-center">
            <Reveal className="max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
                     <Building2 className="w-4 h-4 text-primary" />
                     <span className="text-xs font-bold tracking-widest uppercase text-gray-900">Since 2012</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                    Building Trust, <br/>
                    <span className="text-primary">Delivering Dreams</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
                    We are Nagpur's premier real estate development company, dedicated to creating sustainable, legal, and high-value residential communities.
                </p>
            </Reveal>
        </div>
      </div>

      {/* IMAGE & STATS SECTION - Clean Grid */}
      <div className="container px-4 py-24">
         <div className="grid lg:grid-cols-2 gap-16 items-center">
             <Reveal className="relative">
                 <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl relative z-10">
                    <img src="/hero-image.png" alt="Our Team" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <p className="font-bold text-lg">Headquarters</p>
                        <p className="text-white/80 text-sm">Nagpur, Maharashtra</p>
                    </div>
                 </div>
                 {/* Decorative simple box */}
                 <div className="absolute -top-4 -right-4 w-full h-full border-2 border-gray-100 rounded-3xl -z-0" />
             </Reveal>
             
             <div className="space-y-10">
                <Reveal delay={200}>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Who We Are</h2>
                    
                    {/* Channel Partner Badge */}
                    <div className="inline-block bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-6">
                        <p className="text-primary font-bold text-sm uppercase tracking-wider mb-1">Proudly Associated With</p>
                        <p className="text-gray-900 font-bold text-lg">Authorized Channel Partner of MAULI INFRA</p>
                    </div>

                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        Divine Square Infra is not just a real estate company; we are partners in your wealth creation journey. Specializing in RERA-approved residential plots, we ensure that every square foot you buy is legally secure and primed for growth.
                    </p>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        Our philosophy is simple: <strong>Transparency, Integrity, and Excellence.</strong> We don't just sell plots; we build relationships that last generations.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-4xl font-bold text-primary mb-1">10+</p>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Years Experience</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary mb-1">500+</p>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Happy Families</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary mb-1">15+</p>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Projects Completed</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary mb-1">100%</p>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Legal Compliance</p>
                        </div>
                    </div>
                </Reveal>
             </div>
         </div>
      </div>

      {/* VALUES SECTION - Minimal Cards */}
      <div className="bg-gray-50 py-24">
         <div className="container px-4">
             <Reveal className="text-center max-w-2xl mx-auto mb-16">
                 <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                 <p className="text-lg text-gray-600">The principles that guide every decision we make to ensure your satisfaction.</p>
             </Reveal>

             <div className="grid md:grid-cols-4 gap-8">
                 {[
                     { icon: <Award className="w-6 h-6"/>, title: "Excellence", desc: "We strive for perfection in layout planning and development." },
                     { icon: <Users className="w-6 h-6"/>, title: "Customer First", desc: "Your satisfaction and security is our top priority." },
                     { icon: <Target className="w-6 h-6"/>, title: "Integrity", desc: "100% Transparency in pricing and documentation." },
                     { icon: <HeartHandshake className="w-6 h-6"/>, title: "Commitment", desc: "We support you even after the sale is complete." },
                 ].map((val, i) => (
                     <Reveal key={i} delay={i * 100} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                         <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6">
                             {val.icon}
                         </div>
                         <h3 className="text-xl font-bold mb-3 text-gray-900">{val.title}</h3>
                         <p className="text-gray-600 leading-relaxed text-sm">{val.desc}</p>
                     </Reveal>
                 ))}
             </div>
         </div>
      </div>

      {/* NEW: PROCESS / TIMELINE - Vertical Clean */}
      <div className="container px-4 py-24">
          <Reveal className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Methodology</h2>
              <p className="text-lg text-gray-600">How we ensure every project meets our high standards.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Land Acquisition", desc: "We meticulously select land parcels in high-growth corridors like MIHAN and Metro routes." },
                { title: "Legal Verification", desc: "Our legal team conducts rigorous due diligence to ensure clear titles and zero litigations." },
                { title: "Infrastructure Development", desc: "We develop complete infrastructure - roads, electricity, water - before handing over." }
              ].map((step, i) => (
                  <Reveal key={i} delay={i * 150} className="relative pl-8 border-l-2 border-gray-200 pb-8 last:border-0 md:border-0 md:pl-0 md:text-center">
                      {/* Mobile dot */}
                      <span className="absolute left-[-5px] top-0 w-3 h-3 rounded-full bg-primary md:hidden" />
                      
                      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-6 hidden md:flex shadow-lg shadow-primary/30">
                          {i+1}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.desc}</p>
                  </Reveal>
              ))}
          </div>
      </div>

    </div>
  );
}
