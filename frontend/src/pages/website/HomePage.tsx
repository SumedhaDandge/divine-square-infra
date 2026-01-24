
import { useEffect, useState, useRef } from "react";
import { ArrowRight, CheckCircle2, MapPin, Calendar, Star, Building2, Phone, TrendingUp, ShieldCheck, PieChart, ArrowUpRight, Quote, BookOpenCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useDataContext } from "@/contex/DataContext";
import { cn } from "@/lib/utils";

// --- Clean Animation Components ---

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

const AnimatedCounter = ({ end, suffix = "" }: { end: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated) {
                setHasAnimated(true);
                const duration = 2000;
                const steps = 60;
                const stepTime = duration / steps;
                let current = 0;
                const increment = end / steps;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= end) {
                        setCount(end);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(current));
                    }
                }, stepTime);
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, hasAnimated]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { fetchProjects, isLoading } = useProjects();
  const { projects } = useDataContext();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); 

  const faqs = [
      { q: "Is investing in plots safe with Divine Square?", a: "Absolutely. We pride ourselves on 100% legal compliance. Every project is NMRDA sanctioned, RERA registered, and has clear titles. We encourage you to have your legal advisor verify all documents before booking." },
      { q: "What kind of appreciation can I expect?", a: "While market conditions vary, our projects are strategically located in high-growth corridors (near Metro, Highways, MIHAN). Historically, our customers have seen 15-20% annual appreciation on their investments." },
      { q: "Do you help with bank loans?", a: "Yes, we have tie-ups with all major nationalized banks (SBI, BoI, etc.) and private banks (HDFC, ICICI). Our dedicated team assists you with the entire loan documentation and approval process." },
      { q: "What happens after I book a plot?", a: "Once you book, we sign a Sale Agreement. We then assist you with the loan process (if needed). Upon full payment, we facilitate the Sale Deed registration at the sub-registrar's office, making you the legal owner." }
  ];

  useEffect(() => {
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  const featuredProjects = projects?.filter((p: any) => p.status === "active").slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground selection:bg-primary/10 selection:text-primary">
      
      {/* HERO SECTION - Immersive Cinematic Layout */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10" />
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay z-10" /> {/* Texture */}
             <img 
                src="/hero-new.jpg" 
                alt="Hero Property" 
                className="w-full h-full object-cover scale-105 animate-slow-zoom" 
             />
        </div>

        <div className="container relative z-20 px-4 text-center">
            <Reveal className="max-w-5xl mx-auto space-y-10">
                {/* Modern Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mx-auto transform hover:scale-105 transition-transform duration-300 cursor-default">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/90">
                        Authorized Partner: Mauli Infra
                    </span>
                </div>
                
                {/* Grand Title */}
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                    Experience the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200">
                        Art of Living.
                    </span>
                </h1>
                
                {/* Refined Subtitle */}
                <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
                   Discover NMRDA sanctioned premium plots in Nagpur's most promising locations. 
                   <span className="block mt-2 font-medium text-white">Legal Purity. Strategic Growth. Timeless Value.</span>
                </p>

                {/* Dual Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 items-center">
                     <button 
                        onClick={() => navigate('/projects-public')} 
                        className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-full shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:bg-emerald-500 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] transition-all flex items-center justify-center gap-3 group"
                     >
                        Explore Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                     <button 
                         onClick={() => navigate('/contact')} 
                         className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-full backdrop-blur-md border border-white/20 hover:bg-white hover:text-emerald-900 transition-all flex items-center justify-center"
                     >
                        Schedule Site Visit
                     </button>
                </div>
            </Reveal>
        </div>
        
        {/* Bottom Trust Strip (New Element to replace mouse icon) */}
        <div className="absolute bottom-0 w-full z-20 border-t border-white/10 bg-black/20 backdrop-blur-sm hidden md:block">
            <div className="container px-4 py-6">
                 <div className="flex justify-center gap-12 text-white/60">
                     {['100% Clear Titles', 'NMRDA Sanctioned', 'Bank Finance Available', 'Prime Locations'].map((item, i) => (
                         <div key={i} className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                             <ShieldCheck size={16} className="text-emerald-500" /> {item}
                         </div>
                     ))}
                 </div>
            </div>
        </div>
      </section>

      {/* STATS - Modern Floating Strip */}
      <section className="relative z-30 -mt-20 pb-20 pointer-events-none">
          <div className="container px-4">
              <Reveal>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 pointer-events-auto">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:divide-x divide-gray-100">
                          {[
                            { label: "Happy Families", val: 500, suffix: "+" },
                            { label: "Years Experience", val: 12, suffix: "+" },
                            { label: "Projects Completed", val: 25, suffix: "+" },
                            { label: "Appreciation", val: 150, suffix: "%" }
                          ].map((stat, i) => (
                              <div key={i} className="text-center px-4 group">
                                  <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                                      <AnimatedCounter end={stat.val} suffix={stat.suffix} />
                                  </p>
                                  <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </Reveal>
          </div>
      </section>

      {/* WHY CHOOSE US - Creative & Dark */}
      <section className="py-32 bg-emerald-950 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
          {/* Creative Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-800/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow animation-delay-2000" />

          <div className="container px-4 relative z-10">
              <Reveal className="text-center max-w-3xl mx-auto mb-20">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-6">
                      <Star size={12} className="text-emerald-400 fill-emerald-400" />
                      <span className="text-emerald-300 font-bold uppercase tracking-widest text-xs">The Divine Advantage</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                      Why Smart Investors <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400">Choose Confidence.</span>
                  </h2>
              </Reveal>

              {/* Creative Connected Grid */}
              <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
                   {/* Connecting Line (Desktop) */}
                   <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent hidden md:block" />

                   {[
                       { number: "01", icon: TrendingUp, title: "High Appreciation", desc: "Strategic locations near MIHAN and Metro corridors ensure 15-20% annual ROI." },
                       { number: "02", icon: ShieldCheck, title: "100% Legal Safety", desc: "Zero tolerance for ambiguity. All projects are RERA registered & NMRDA sanctioned.", highlighted: true },
                       { number: "03", icon: BookOpenCheck, title: "Transparent Dealing", desc: "What you see is what you pay. No hidden costs, just pure peace of mind." }
                   ].map((feature, i) => (
                       <Reveal key={i} delay={i * 150} className={cn(
                           "relative group",
                           feature.highlighted ? "md:translate-y-12" : "" // Stagger effect
                       )}>
                           {/* Card Container */}
                           <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] hover:-translate-y-2">
                               
                               {/* Large Creative Number Background */}
                               <span className="absolute -right-4 -top-4 text-[8rem] font-black text-white/5 group-hover:text-white/10 transition-colors select-none leading-none z-0">
                                   {feature.number}
                               </span>

                               {/* Icon Area */}
                               <div className="relative z-10 w-20 h-20 mx-auto mb-8 relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <feature.icon size={32} className="text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,0.5)]" />
                                    </div>
                               </div>

                               {/* Content */}
                               <div className="relative z-10 text-center">
                                   <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
                                   <p className="text-emerald-100/70 leading-relaxed text-sm font-light">
                                       {feature.desc}
                                   </p>
                               </div>

                               {/* Bottom Active Line */}
                               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                           </div>
                       </Reveal>
                   ))}
              </div>
          </div>
      </section>

      {/* OUR STORY - Sophisticated Split */}
      <section className="py-24 bg-white overflow-hidden">
          <div className="container px-4">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                  <Reveal>
                      <div className="relative">
                           {/* Clean Image with Decoration */}
                          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                              <img src="/hero-image.png" alt="About Divine Square" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                          </div>
                          
                          {/* Decorative Elements */}
                          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
                          
                          {/* Quote Card */}
                          <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-xl border border-gray-100 shadow-lg z-20">
                              <p className="text-gray-900 font-serif italic text-lg mb-2">"We build the canvas for your family's future."</p>
                              <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">— Director's Vision</p>
                          </div>
                      </div>
                  </Reveal>
                  
                  <Reveal delay={200}>
                      <div className="space-y-6">
                           <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest rounded-full">
                               Since 2012
                           </div>
                           <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                               Building Trust, <br/><span className="text-emerald-600">Delivering Dreams.</span>
                           </h2>
                           <div className="w-20 h-1.5 bg-amber-400 rounded-full" />
                           
                           <div className="space-y-4 text-lg text-gray-600 font-light leading-relaxed">
                               <p>
                                   At Divine Square Infra, we realized that buying a plot is often filled with uncertainty. We set out to change that by establishing a brand rooted in <strong>transparency, legality, and commitment</strong>.
                               </p>
                               <p>
                                   With over a decade of experience in Nagpur's real estate market, we have successfully handed over happiness to 500+ families. Our projects are communities designed for holistic living.
                               </p>
                           </div>

                           <div className="pt-4 flex items-center gap-6">
                               <Link to="/about" className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg">
                                   Read Our Story
                               </Link>
                               <Link to="/projects-public" className="font-bold text-gray-900 hover:text-emerald-600 transition-colors underline decoration-2 decoration-amber-400 underline-offset-4">
                                   View Projects
                               </Link>
                           </div>
                      </div>
                  </Reveal>
              </div>
          </div>
      </section>

      {/* JOURNEY MAP - Vertical Zig-Zag Timeline */}
      <section className="py-32 bg-white relative overflow-hidden">
          <div className="container px-4 relative z-10 max-w-5xl mx-auto">
              <Reveal className="text-center mb-24">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                      Process
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Path to Ownership</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">
                      We plan everything so you don't have to. A seamless 4-step journey to your dream plot.
                  </p>
              </Reveal>

              <div className="relative">
                  {/* Central Timeline Line */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 -translate-x-1/2 hidden md:block" />
                  
                  <div className="space-y-12 md:space-y-24">
                      {[
                          { step: "01", icon: Phone, title: "Connect & Consult", desc: "Schedule a free site visit. Our experts pick you up, show you around, and answer every question." },
                          { step: "02", icon: MapPin, title: "Select Your Spot", desc: "Choose the perfect plot based on Vastu, budget, and future growth potential." },
                          { step: "03", icon: ShieldCheck, title: "Legal Verification", desc: "We provide complete documentation for you to verify with your legal advisor. 100% Transparency." },
                          { step: "04", icon: CheckCircle2, title: "Registration & Joy", desc: "Sign the sale deed, complete the registry, and celebrate. Welcome to the family!" }
                      ].map((item, i) => (
                          <div key={i} className={cn(
                              "flex flex-col md:flex-row items-center gap-8 md:gap-16 relative",
                              i % 2 === 0 ? "" : "md:flex-row-reverse"
                          )}>
                              {/* Central Dot */}
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-emerald-500 rounded-full z-20 hidden md:block shadow-[0_0_0_8px_rgba(255,255,255,1)]" />

                              {/* Content Side */}
                              <div className={cn("flex-1 text-center md:text-left", i % 2 === 0 ? "md:text-right" : "md:text-left")}>
                                  <Reveal delay={i * 100} className="space-y-4">
                                      <div className={cn(
                                          "inline-flex w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 items-center justify-center mb-2 shadow-sm",
                                          i % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                                      )}>
                                          <item.icon size={32} />
                                      </div>
                                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                          <span className="text-emerald-500/50 text-sm font-black uppercase tracking-widest block mb-1">Step {item.step}</span>
                                          {item.title}
                                      </h3>
                                  </Reveal>
                              </div>

                              {/* Description Side (Visual) */}
                              <div className="flex-1">
                                  <Reveal delay={i * 100 + 100}>
                                      <div className={cn(
                                          "bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-emerald-100 transition-colors relative group",
                                          i % 2 === 0 ? "md:rounded-tr-[4rem]" : "md:rounded-tl-[4rem]"
                                      )}>
                                          <p className="text-gray-600 leading-relaxed text-lg">
                                              {item.desc}
                                          </p>
                                          <div className="absolute top-4 right-4 text-6xl font-black text-gray-100 -z-10 group-hover:text-emerald-50 transition-colors">
                                              {item.step}
                                          </div>
                                      </div>
                                  </Reveal>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>
      
      {/* FEATURED PROJECTS - Modern Framed (Consistent Theme) */}
      <section className="py-24 bg-white relative">
          <div className="container px-4">
               <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                   <div>
                       <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
                           Our Portfolio
                       </span>
                       <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Developments</h2>
                   </div>
                   <Link to="/projects-public" className="group hidden md:inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-primary transition-colors border-b border-gray-200 hover:border-primary pb-1">
                       View All Projects <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
               </div>

               {isLoading ? (
                  <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"/></div>
              ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {(projects?.filter((p: any) => p.status === "active").slice(0, 4) || []).map((project: any, index: number) => (
                          <Reveal key={project._id} delay={index * 100} className="h-full">
                             <Link to={`/projects-public/${project._id}`} className="block h-full group">
                                <div className="bg-white rounded-2xl border border-gray-100 p-3 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                    {/* Framed Image Container */}
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-gray-100">
                                        <img 
                                            src="/hero-image.png" 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            alt={project.projectName} 
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        
                                        {/* Simple Tag */}
                                        <div className="absolute top-3 left-3">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 text-white",
                                                project.status === 'active' ? "bg-emerald-500/90" :
                                                project.status === 'completed' ? "bg-blue-500/90" : "bg-amber-500/90"
                                            )}>
                                                {project.status === 'active' ? 'Active' : project.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Clean Content */}
                                    <div className="pt-4 px-1 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors truncate">{project.projectName}</h3>
                                        <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 font-medium">
                                            <MapPin size={12} /> {project.location}
                                        </p>
                                        
                                        {/* Info Box */}
                                        <div className="mt-auto bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                                            <div>
                                                 <p className="text-[10px] text-gray-400 uppercase font-bold">Starts From</p>
                                                 <p className="text-sm font-bold text-gray-900">
                                                     ₹{project.priceRange?.min ? (project.priceRange.min / 100000).toFixed(1) + " L" : "On Request"}
                                                 </p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-colors">
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </Link>
                          </Reveal>
                      ))}
                  </div>
              )}
              
              <div className="mt-8 text-center md:hidden">
                   <Link to="/projects-public" className="btn-secondary">View All Projects</Link>
              </div>
          </div>
      </section>

      {/* NEW: FAQ SECTION - Modern Split Layout */}
      <section className="py-24 bg-gray-50">
          <div className="container px-4">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                  <Reveal className="lg:col-span-4">
                      <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Common Questions</span>
                      <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Got Questions? We have Answers.</h2>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                          Buying land is a big decision. We're here to provide clarity and transparency at every step.
                      </p>
                      
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                          <h4 className="font-bold text-lg mb-2">Still have questions?</h4>
                          <p className="text-sm text-gray-500 mb-4">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                          <Link to="/contact" className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-all">
                              Contact Support
                          </Link>
                      </div>
                  </Reveal>
                  
                  <div className="lg:col-span-8 space-y-4">
                      {faqs.map((faq, i) => (
                          <Reveal key={i} delay={i * 100}>
                              <div 
                                className={cn(
                                    "bg-white rounded-2xl border transition-all duration-300 overflow-hidden w-full",
                                    openFaqIndex === i ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                  <button 
                                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                      className="flex justify-between items-center w-full p-6 text-left"
                                  >
                                      <span className={cn("font-bold text-lg", openFaqIndex === i ? "text-primary" : "text-gray-800")}>
                                          {faq.q}
                                      </span>
                                      <span className={cn(
                                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-4",
                                          openFaqIndex === i ? "bg-primary text-white rotate-0" : "bg-gray-50 text-gray-400 -rotate-90"
                                      )}>
                                          <ArrowRight size={16} className="transition-transform" />
                                      </span>
                                  </button>
                                  
                                  <div 
                                      className={cn(
                                          "px-6 transition-all duration-300 ease-in-out border-t border-dashed border-gray-100 overflow-hidden",
                                          openFaqIndex === i ? "max-h-48 opacity-100 pb-8 pt-4" : "max-h-0 opacity-0 py-0"
                                      )}
                                  >
                                      <p className="text-gray-600 leading-relaxed">
                                          {faq.a}
                                      </p>
                                  </div>
                              </div>
                          </Reveal>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* CTA Section - Clean & Direct */}
      <section className="py-24 bg-gray-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 z-0"/>
          <div className="container px-4 relative z-10">
             <Reveal className="max-w-3xl mx-auto">
                 <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to find your perfect plot?</h2>
                 <p className="text-xl text-white/80 mb-10 font-light">
                    Schedule a free site visit today. Our team will help you find the best investment for your future.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/contact" className="px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl shadow-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Book Site Visit
                    </Link>
                    <a href="tel:+918767160868" className="px-8 py-4 bg-primary-dark border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5" />
                        Talk to Expert
                    </a>
                 </div>
             </Reveal>
          </div>
      </section>

    </div>
  );
}
