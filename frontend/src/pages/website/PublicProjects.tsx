
import { useProjects } from "@/hooks/useProjects";
import { useDataContext } from "@/contex/DataContext";
import { useEffect, useState, useRef } from "react";
import { Building2, MapPin, ArrowRight, ArrowUpRight, FileCheck, Landmark, TrendingUp, Zap, Droplets, Trees, ShieldCheck, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// --- Clean Reveal Component ---
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

// ... (imports remain)

export default function PublicProjects() {
  const { fetchProjects, isLoading } = useProjects();
  const { projects } = useDataContext();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = projects?.filter((p: any) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  return (
    <div className="min-h-screen bg-stone-50/50">
       {/* 1. Header Section - Split Layout */}
       <section className="bg-white pt-32 pb-16 border-b border-gray-100">
            <div className="container px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <Reveal>
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
                                Real Estate Portfolio
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                                Premium Open <br/>
                                <span className="text-primary">Plots in Nagpur.</span>
                            </h1>
                            <p className="text-gray-500 text-lg leading-relaxed max-w-lg mb-8">
                                Discover our handpicked selection of NMRDA sanctioned & RERA registered developments in Nagpur's prime growth corridors.
                            </p>
                        </div>
                    </Reveal>

                    {/* Right: Trust Cards (Moved here) */}
                    <Reveal delay={200} className="w-full">
                         <div className="grid gap-4">
                            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                                     <FileCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">NMRDA Sanctioned</h3>
                                    <p className="text-sm text-gray-500">100% Clear Titles & Ownership</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300 ml-0 lg:ml-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                     <Landmark size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Bank Loan Available</h3>
                                    <p className="text-sm text-gray-500">From all Leading Nationalized Banks</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                                     <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">High Growth Areas</h3>
                                    <p className="text-sm text-gray-500">Strategic Locations for Best Returns</p>
                                </div>
                            </div>
                         </div>
                    </Reveal>
                </div>
            </div>
       </section>

       {/* 2. Premium Amenities Marquee - Sleek & Compact */}
       <section className="py-8 bg-gray-900 overflow-hidden border-y border-gray-800">
            <div className="flex animate-marquee hover:pause whitespace-nowrap">
                {/* Double the list for seamless loop */}
                {[...Array(2)].map((_, widthIndex) => (
                    <div key={widthIndex} className="flex gap-12 items-center mx-6">
                        {[
                            { title: "Cement Roads", icon: MapPin },
                            { title: "Underground Electricity", icon: Zap },
                            { title: "24/7 Water Supply", icon: Droplets },
                            { title: "Lush Green Gardens", icon: Trees },
                            { title: "Gated Security", icon: ShieldCheck },
                            { title: "Kids Play Area", icon: Gamepad2 },
                            { title: "Sewage Treatment", icon: Droplets }, // Reusing icon for example
                            { title: "Street Lights", icon: Zap }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                                <item.icon size={20} className="text-primary" />
                                <span className="text-lg font-medium tracking-wide">{item.title}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-700 ml-12" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
       </section>

       <div className="container px-4 pb-24">
          {/* Clean Filter Tabs */}
          <Reveal delay={100} className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
             <div className="text-gray-400 text-sm font-medium">
                Showing {filteredProjects?.length || 0} projects
             </div>
             
             <div className="flex flex-wrap justify-center gap-2 bg-white p-1.5 rounded-3xl border border-gray-200 shadow-sm max-w-full">
                {['all', 'active', 'completed', 'upcoming'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={cn(
                            "px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all capitalize",
                            filter === status 
                                ? "bg-gray-900 text-white shadow-md" 
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        {status}
                    </button>
                ))}
             </div>
          </Reveal>

          {isLoading ? (
             <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"/></div>
          ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProjects?.map((project: any, index: number) => (
                   <Reveal key={project._id} delay={index * 100} className="h-full">
                       <Link to={`/projects-public/${project._id}`} className="block h-full group">
                           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 h-full flex flex-col overflow-hidden hover:-translate-y-1">
                               {/* Image Container */}
                               <div className="h-64 overflow-hidden relative">
                                    <img 
                                      src="/hero-image.png" 
                                      alt={project.projectName} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                         <span className={cn(
                                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm",
                                            project.status === 'active' ? "bg-emerald-500/90 text-white" :
                                            project.status === 'completed' ? "bg-blue-500/90 text-white" : "bg-amber-500/90 text-white"
                                         )}>
                                            {project.status}
                                         </span>
                                    </div>

                                    {/* Overlay Info */}
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="text-xl font-bold leading-tight mb-1 group-hover:text-emerald-300 transition-colors">{project.projectName}</h3>
                                        <p className="text-white/80 text-xs flex items-center gap-1">
                                            <MapPin size={12} /> {project.location}
                                        </p>
                                    </div>
                               </div>
                               
                               {/* Brief Details */}
                               <div className="p-4 flex flex-col flex-grow bg-white relative z-10">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Price</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                ₹{project.priceRange?.min ? (project.priceRange.min / 100000).toFixed(1) + " L" : "On Request"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Units</p>
                                             <p className="text-sm font-bold text-gray-900">{project.totalUnits}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-primary">
                                        <span>View Highlihts</span>
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
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
          
          {!isLoading && filteredProjects?.length === 0 && (
             <div className="text-center py-24 text-gray-400">
                <p>No projects found matching the selected filter.</p>
             </div>
          )}
       </div>
          
       {/* 3. CTA / Help Section */}
       <section className="bg-white border-t border-gray-100 py-16">
            <div className="container px-4">
                <Reveal className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden text-center text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Can't decide which plot is right for you?</h2>
                        <p className="text-white/70 mb-8 text-lg font-light">
                            Our land experts can help you compare projects and find the investment that matches your goals and budget.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                                Schedule Free Site Visit
                            </Link>
                            <a href="tel:+918767160868" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Talk to Expert
                            </a>
                        </div>
                    </div>
                </Reveal>
            </div>
       </section>
    </div>
  );
}
