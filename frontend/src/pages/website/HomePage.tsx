
import { useEffect, useState, useRef } from "react";
import { ArrowRight, CheckCircle2, MapPin, Calendar, Star, Building2, Phone, TrendingUp, ShieldCheck, PieChart, ArrowUpRight, Quote } from "lucide-react";
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
      
      {/* CLEAN HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40 z-10" />
            {/* Subtle Zoom Effect only */}
            <img src="/hero-image.png" alt="Hero" className="w-full h-full object-cover animate-pulse-soft" />
        </div>
        
        <div className="container relative z-20 px-4 text-center mt-10">
            <Reveal className="space-y-8 max-w-4xl mx-auto">
                <div className="inline-flex flex-col items-center gap-2 mb-4">
                     <span className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white border border-white/20">
                        Authorized Channel Partner
                     </span>
                     <span className="text-xl md:text-2xl font-bold text-white tracking-wide">
                        MAULI INFRA
                     </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                    Building Legacy, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-100">One Plot at a Time.</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
                    Secure your future with Nagpur’s most trusted real estate developer. Legal clarity, prime locations, and unmatched growth.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                     <button onClick={() => navigate('/projects-public')} className="px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl shadow-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        View Projects <ArrowRight size={20} />
                     </button>
                     <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-transparent border border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all">
                        Contact Us
                     </button>
                </div>
            </Reveal>
        </div>
        
        {/* Simple scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                <div className="w-1 h-2 bg-white/50 rounded-full" />
            </div>
        </div>
      </section>

      {/* STATS - Clean & Minimal */}
      <section className="py-20 bg-white border-b border-gray-100">
          <div className="container px-4">
              <Reveal>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
                      {[
                        { label: "Happy Families", val: 500, suffix: "+" },
                        { label: "Years Experience", val: 10, suffix: "+" },
                        { label: "Completed Projects", val: 15, suffix: "+" },
                        { label: "Appreciation", val: 100, suffix: "%" }
                      ].map((stat, i) => (
                          <div key={i} className="text-center px-4">
                              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                  <AnimatedCounter end={stat.val} suffix={stat.suffix} />
                              </p>
                              <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">{stat.label}</p>
                          </div>
                      ))}
                  </div>
              </Reveal>
          </div>
      </section>

      {/* MARKET INSIGHTS - Professional Cards */}
      <section className="py-24 bg-gray-50">
          <div className="container px-4">
              <Reveal className="mb-16 text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Invest With Us?</h2>
                  <p className="text-lg text-gray-600">We offer more than just land; we offer a secure foundation for your wealth and future generations.</p>
              </Reveal>

              <div className="grid lg:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                      <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                          <TrendingUp className="text-emerald-600 w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">High Appreciation</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                          Land in Nagpur's developing corridors has shown consistent double-digit growth year over year, outperforming traditional assets.
                      </p>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
                      </div>
                      <p className="text-right text-xs font-bold text-emerald-600 mt-2">+85% Growth (5Y)</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                      <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                          <ShieldCheck className="text-amber-600 w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">100% Legal Safety</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                          Every project is NMRDA sanctioned and RERA registered. We prioritize clear titles above all else.
                      </p>
                      <ul className="space-y-2">
                          {['RERA Registered', 'NMRDA Sanctioned', 'Clear Title'].map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                  <CheckCircle2 size={16} className="text-amber-500" /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
                  
                  {/* Card 3 */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                          <MapPin className="text-blue-600 w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">Strategic Locations</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                          Proximity to MIHAN, Samruddhi Mahamarg, and Metro stations ensures your connectivity is future-proof.
                      </p>
                      <div className="flex gap-4">
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center">
                              <span className="block text-xl font-bold text-gray-900">5km</span>
                              <span className="text-xs text-gray-500 uppercase">Airport</span>
                          </div>
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center">
                              <span className="block text-xl font-bold text-gray-900">2km</span>
                              <span className="text-xs text-gray-500 uppercase">Metro</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* NEW: ABOUT SNIPPET */}
      <section className="py-24 bg-white overflow-hidden">
          <div className="container px-4">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <Reveal>
                      <div className="relative">
                          <div className="aspect-square bg-gray-100 rounded-[2rem] overflow-hidden">
                              <img src="/hero-image.png" alt="About Divine Square" className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-primary rounded-[2rem] p-8 text-white hidden md:flex flex-col justify-center shadow-2xl">
                              <Quote className="w-10 h-10 text-white/20 mb-4" />
                              <p className="text-lg font-light italic leading-relaxed mb-4">
                                  "We don't just sell plots; we build the canvas for your family's future memories."
                              </p>
                              <p className="font-bold text-white">— Director's Vision</p>
                          </div>
                      </div>
                  </Reveal>
                  <Reveal delay={200}>
                      <span className="text-primary font-bold tracking-widest uppercase text-sm">Our Story</span>
                      <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Building Trust Since 2012</h2>
                      <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                          <p>
                              At Divine Square Infra, we realized that buying a plot is often filled with uncertainty. We set out to change that by establishing a brand rooted in <strong>transparency, legality, and commitment</strong>.
                          </p>
                          <p>
                              With over a decade of experience in Nagpur's real estate market, we have successfully handed over happiness to 500+ families. Our projects are not just plots of land but well-planned communities with top-notch amenities.
                          </p>
                      </div>
                      <div className="pt-8">
                          <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                              Read Our Full Story <ArrowRight size={20} />
                          </Link>
                      </div>
                  </Reveal>
              </div>
          </div>
      </section>

      {/* NEW: PROCESS STEPS */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container px-4 relative z-10">
              <Reveal className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Journey to Ownership</h2>
                  <p className="text-white/80 max-w-2xl mx-auto text-lg">We've simplified the buying process to make it hassle-free for you.</p>
              </Reveal>

              <div className="grid md:grid-cols-4 gap-8">
                  {[
                      { step: "01", title: "Site Visit", desc: "Schedule a free pick-up & drop to visit our premium locations." },
                      { step: "02", title: "Selection", desc: "Choose the perfect plot that fits your budget and vastu needs." },
                      { step: "03", title: "Legal Check", desc: "Verify all documents with your legal advisor for 100% peace of mind." },
                      { step: "04", title: "Registration", desc: "Complete the sale deed and become a proud owner." }
                  ].map((item, i) => (
                      <Reveal key={i} delay={i * 100} className="relative group">
                          <div className="text-6xl font-black text-white/10 mb-[-20px] ml-4 relative z-0 group-hover:text-white/20 transition-colors">
                              {item.step}
                          </div>
                          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative z-10 hover:bg-white/20 transition-all h-full">
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                      </Reveal>
                  ))}
              </div>
          </div>
      </section>
      
      {/* FEATURED PROJECTS - Redesigned Modern */}
      <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          
          <div className="container px-4 relative z-10">
               <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                   <div className="max-w-2xl">
                       <span className="text-primary font-bold tracking-widest uppercase text-sm flex items-center gap-2 mb-3">
                           <span className="w-8 h-[2px] bg-primary"></span>
                           Our Portfolio
                       </span>
                       <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Signature Developments</h2>
                   </div>
                   <Link to="/projects-public" className="group flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full font-semibold text-gray-900 hover:bg-primary hover:text-white transition-all duration-300">
                       Explore All Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
               </div>

               {isLoading ? (
                  <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"/></div>
              ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                      {featuredProjects.map((project: any, index: number) => (
                          <Reveal key={project._id} delay={index * 150} className="group h-full">
                             <Link to={`/projects-public/${project._id}`} className="block h-full relative">
                                <div className="h-full bg-white rounded-[2rem] overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 flex flex-col">
                                    {/* Image Container with Overlay */}
                                    <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-[1.5rem]">
                                        <img src="/hero-image.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={project.projectName} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                                        
                                        <div className="absolute top-4 left-4">
                                            <span className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/10",
                                                project.status === 'active' ? "bg-emerald-500/90 text-white" :
                                                project.status === 'completed' ? "bg-blue-500/90 text-white" : "bg-amber-500/90 text-white"
                                            )}>
                                                {project.status}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                                View Details <ArrowUpRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6 pt-2 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{project.projectName}</h3>
                                        </div>
                                        <p className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
                                            <MapPin size={16} className="text-primary/70" /> {project.location}
                                        </p>
                                        
                                        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-gray-200">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Starting From</p>
                                                <p className="text-lg font-bold text-primary">₹{project.priceRange?.min ? (project.priceRange.min / 100000).toFixed(1) + " L" : "On Request"}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Units</p>
                                                <p className="text-lg font-bold text-gray-900">{project.totalUnits}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </Link>
                          </Reveal>
                      ))}
                  </div>
              )}
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
                                    "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
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
