import { Building2, Award, Users, Target, HeartHandshake, ArrowRight, CheckCircle2, Clock, ShieldCheck, Quote, MapPin, TrendingUp, Lightbulb, Compass, Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Creative Reveal Component
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

// Animated Counter with Scroll Trigger
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated) {
                setHasAnimated(true);
                let startTimestamp: number | null = null;
                const step = (timestamp: number) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    setCount(Math.floor(progress * end));
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
            }
        });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutPage() {
    
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 overflow-hidden font-sans">
      
      {/* 1. CREATIVE HERO - Split & Sophisticated (Brand Theme) */}
      <div className="relative min-h-[85vh] flex items-center bg-[#0b2c24] overflow-hidden text-white">
         {/* Abstract Elements */}
         <div className="absolute top-0 right-0 w-[60%] h-full bg-[#08221c] clip-path-diagonal hidden lg:block" />
         <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
         
         <div className="container relative z-10 px-4">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                 <Reveal className="text-left">
                    <div className="inline-flex items-center gap-3 mb-8">
                        <span className="h-px w-8 bg-emerald-400"></span>
                        <span className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-bold">Official Partner: Mauli Infra Group</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-sans font-bold leading-tight mb-8">
                        Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 italic">Premium</span> Meets <br/>
                        Possibility.
                    </h1>
                    
                    <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg font-light">
                        Divine Square Infra curates the finest land parcels in Nagpur. We provide the clarity, legality, and vision you need to build your legacy.
                    </p>
                    
                    <button onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-4 text-white">
                        <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                        </span>
                        <span className="uppercase tracking-widest text-sm font-bold">Discover Our Story</span>
                    </button>
                 </Reveal>
                 
                 <Reveal delay={200} className="relative hidden lg:block">
                     <div className="relative z-10 p-4 border border-white/10 rounded-2xl">
                         <div className="aspect-[4/5] rounded-xl overflow-hidden relative">
                             <img src="/hero-image.png" alt="Luxury Land" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
                             <div className="absolute inset-0 ring-1 ring-inset ring-white/10"></div>
                         </div>
                         {/* Floating Card */}
                         <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-8 shadow-2xl rounded-tr-3xl max-w-xs animate-fade-in-up">
                             <Quote className="w-8 h-8 text-primary mb-4" />
                             <p className="font-medium italic text-lg leading-relaxed text-gray-700">
                                 "We curate land that doesn't just appreciate in value, but in memories."
                             </p>
                         </div>
                     </div>
                 </Reveal>
             </div>
         </div>
      </div>

      {/* 2. CREATIVE JOURNEY - Staircase Layout */}
      <div id="journey" className="py-24 bg-stone-50 overflow-hidden">
          <div className="container px-4">
              <Reveal className="text-center mb-20">
                  <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Our Timeline</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">The Path We Paved</h2>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[ 
                    { year: "2012", title: "Genesis", desc: "Started with a vision for transparent realty in Nagpur." },
                    { year: "2015", title: "Expansion", desc: "Delivered our first township, marking a new era of trust." },
                    { year: "2018", title: "Partnership", desc: "Joined hands with Mauli Infra to offer premium layouts." },
                    { year: "2024", title: "Innovation", desc: "Embracing digital frontiers to serve global investors." }
                  ].map((item, i) => (
                      <Reveal key={i} delay={i * 200} className="relative group">
                          {/* Card */}
                          <div className={cn(
                              "bg-white p-8 shadow-lg border-b-4 border-transparent hover:border-primary transition-all duration-500 h-full flex flex-col justify-between relative z-10 rounded-xl",
                              i % 2 === 0 ? "mt-0" : "lg:mt-12" // Stagger effect
                          )}>
                              <div>
                                <span className="text-6xl font-black text-gray-100 absolute top-4 right-4 -z-10">{item.year}</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                              </div>
                              <div className="mt-8 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                  <ArrowRight className="w-4 h-4" />
                              </div>
                          </div>
                      </Reveal>
                  ))}
              </div>
          </div>
      </div>

      
      {/* 4. VISION & MISSION - Creative Hexagon Grid */}
      <div className="py-32 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="container px-4 relative z-10">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                  <Reveal>
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                          We Design <br/>
                          <span className="text-primary">Tomorrow</span>
                      </h2>
                      <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                          Our philosophy is simple: innovative layouts, transparent dealings, and future-proof locations.
                      </p>
                      <div className="flex gap-4">
                          <div className="w-16 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                          <div className="w-8 h-1 bg-gray-700 rounded-full"></div>
                      </div>
                  </Reveal>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Reveal delay={100} className="bg-gray-800/50 backdrop-blur-md p-8 rounded-tr-[3rem] rounded-bl-[3rem] border border-gray-700 hover:border-primary/50 transition-colors group">
                          <Compass className="w-10 h-10 text-primary mb-6 group-hover:rotate-45 transition-transform duration-500" />
                          <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                              To be the gold standard in Nagpur's real estate, creating sustainable wealth for every investor.
                          </p>
                      </Reveal>

                      <Reveal delay={200} className="bg-gray-800/50 backdrop-blur-md p-8 rounded-tl-[3rem] rounded-br-[3rem] border border-gray-700 hover:border-primary/50 transition-colors mt-8 group">
                          <Lightbulb className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                          <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                              Empowering families with litigation-free lands and world-class infrastructure.
                          </p>
                      </Reveal>
                  </div>
              </div>
          </div>
      </div>
       {/* 5. DIRECTOR'S NOTE - Minimalist Clean */}
      <div className="py-24 bg-white">
          <div className="container px-4 max-w-4xl mx-auto text-center">
             <Reveal>
                 <Quote className="w-16 h-16 text-gray-200 mx-auto mb-8" />
                 <p className="text-2xl md:text-3xl font-light text-gray-800 italic leading-normal mb-10">
                     "Real estate is the only asset that cannot be lost or stolen, nor can it be carried away. Purchased with common sense, paid for in full, and managed with reasonable care, it is about the safest investment in the world."
                 </p>
                 <div className="inline-block border-t-2 border-primary pt-4 px-8">
                     <h4 className="font-bold text-lg text-gray-900">Visionary Leadership</h4>
                     <p className="text-sm text-gray-500 uppercase tracking-widest">Divine Square Infra</p>
                 </div>
             </Reveal>
          </div>
      </div>
    

      {/* 3. IMPACT BY THE NUMBERS - Stats Grid */}
      <div className="py-24 bg-zinc-900 text-white overflow-hidden">
          <div className="container px-4">
              <Reveal className="mb-16 text-center">
                  <h2 className="text-3xl md:text-5xl font-sans font-bold">Impact by the Numbers</h2>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                      { val: 500, label: "Families Housed", suffix: "+", img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80" },
                      { val: 15, label: "Projects Completed", suffix: "+", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80" },
                      { val: 12, label: "Years Excellence", suffix: "+", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" },
                      { val: 100, label: "Legal Clarity", suffix: "%", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80" },
                  ].map((stat, i) => (
                      <Reveal key={i} delay={i * 100} className="group relative h-[320px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500 hover:-translate-y-2">
                          {/* Background Image */}
                          <div className="absolute inset-0">
                              <img src={stat.img} alt={stat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-colors duration-500"></div>
                          </div>
                          
                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                              <div className="w-16 h-16 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                                   <span className="text-white">
                                     {i === 0 && <Users className="w-7 h-7" />}
                                     {i === 1 && <Building2 className="w-7 h-7" />}
                                     {i === 2 && <Award className="w-7 h-7" />}
                                     {i === 3 && <ShieldCheck className="w-7 h-7" />}
                                   </span>
                              </div>
                              <p className="text-5xl font-bold text-white mb-2">
                                  <AnimatedCounter end={stat.val} suffix={stat.suffix} />
                              </p>
                              <p className="text-emerald-300 font-medium uppercase tracking-widest text-sm group-hover:text-emerald-200 transition-colors">
                                  {stat.label}
                              </p>
                          </div>
                      </Reveal>
                  ))}
              </div>
          </div>
      </div>


     

      {/* 6. CTA - Brand Theme (Green) with Fresh Design */}
      <div className="py-28 bg-[#f0fdf4] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-50 opacity-50 skew-x-12 origin-top-right"></div>
          
          <div className="container px-4 relative z-10">
              <Reveal className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 flex flex-col md:flex-row">
                  {/* Left Side: Content */}
                  <div className="p-12 md:w-3/5 flex flex-col justify-center">
                      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                          Ready to <span className="text-emerald-600">Upgrade</span> Your Future?
                      </h2>
                      <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                          Secure your piece of Nagpur's growth story. Mauli Infra plots are selling fast—reserve your site visit today.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                          <input 
                             type="tel" 
                             placeholder="Enter Phone Number" 
                             className="h-12 rounded-lg px-4 bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full"
                          />
                          <button className="h-12 px-8 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all whitespace-nowrap shadow-lg shadow-emerald-200">
                             Get a Call
                          </button>
                      </div>
                      <p className="mt-4 text-xs text-gray-400 text-center sm:text-left">
                          *We respect your privacy. No spam.
                      </p>
                  </div>
                  
                  {/* Right Side: Visual */}
                  <div className="md:w-2/5 bg-emerald-900 relative min-h-[300px]">
                      <img 
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80" 
                        alt="Future Home" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
                      />
                      <div className="absolute inset-0 bg-emerald-900/40"></div>
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                          <p className="font-serif italic text-lg">"The best investment on Earth is earth."</p>
                      </div>
                  </div>
              </Reveal>
          </div>
      </div>

    </div>
  );
}
