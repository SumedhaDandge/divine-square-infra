
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useDataContext } from "@/contex/DataContext";
import { MapPin, CheckCircle2, Calendar, Phone, Download, ArrowLeft, Ruler, Home, Trees, Shield, IndianRupee, FileCheck, Landmark, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { divineSquareService } from "@/services/DivineInfraService";

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

export default function ProjectDetailPublic() {
  const { projectId } = useParams();
  const { fetchProjects } = useProjects();
  const { projects } = useDataContext();
  const [project, setProject] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!projects || projects.length === 0) {
      fetchProjects();
    }
  }, []);

  useEffect(() => {
    if (projects && projectId) {
      const found = projects.find((p: any) => p._id === projectId);
      setProject(found);
      
      // Set initial image
      if (found) {
        if (found.images && found.images.length > 0) {
            setSelectedImage(found.images[0]);
        } else {
            setSelectedImage("/hero-image.png");
        }
      }
      
      window.scrollTo(0, 0);
    }
  }, [projects, projectId]);

  if (!project) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"/></div>;

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-emerald-100 dark:bg-stone-950">
      
      {/* 1. NEW HERO HEADER - Clean Title & Image Grid */}
      <div className="pt-24 lg:pt-32 pb-12 bg-white border-b border-gray-100">
          <div className="container px-4">
              {/* Breadcrumb / Back */}
              <Link to="/projects-public" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors text-sm font-medium group">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
              </Link>
              
              <div className="grid lg:grid-cols-2 gap-8 items-end mb-8">
                  {/* Left: Title & Badges */}
                  <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                              project.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                              {project.status === 'active' ? 'Now Selling' : project.status}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                             <ShieldCheck size={12} /> RERA Approved
                          </span>
                      </div>
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold text-gray-900 leading-tight mb-2">
                          {project.projectName}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-500 flex items-center gap-2">
                          <MapPin size={20} className="text-primary shrink-0" /> {project.location}
                      </p>
                  </div>
                  
                  {/* Right: Price */}
                  <div className="lg:text-right">
                      <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Starting Price</p>
                      <div className="flex items-baseline lg:justify-end gap-2">
                          <p className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                              ₹{project.priceRange?.min ? (project.priceRange.min / 100000).toFixed(1) : "??"}
                          </p>
                          <span className="text-xl md:text-2xl text-gray-400 font-medium">Lakhs*</span>
                      </div>
                  </div>
              </div>

              {/* HERO IMAGE - Single Clean View */}
              <div className="w-full h-[300px] md:h-[500px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl mb-12 relative group">
                  <img 
                      src={project.images?.[0] || "/hero-image.png"} 
                      alt="Main View" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
          </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="container px-4 py-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
              
              {/* LEFT: Project Details */}
              <div className="lg:col-span-8 space-y-12">
                  
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Plot Sizes", value: "1000+ sqft", icon: Ruler, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Total Units", value: project.totalUnits, icon: Home, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Possession", value: "Immediate", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
                        { label: "Legal Status", value: "Clear Title", icon: FileCheck, color: "text-amber-500", bg: "bg-amber-50" },
                      ].map((item, i) => (
                          <Reveal key={i} delay={i * 50} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all group">
                              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.bg, item.color)}>
                                  <item.icon size={24} />
                              </div>
                              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</p>
                              <p className="text-xl font-bold text-gray-900">{item.value}</p>
                          </Reveal>
                      ))}
                  </div>

                  {/* Description & Story */}
                  <Reveal className="prose prose-lg max-w-none text-gray-600">
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 font-sans">About {project.projectName}</h3>
                      <p className="leading-loose text-lg">
                        {project.description || "Located in one of the most promising growth corridors of the city, this project offers a perfect blend of connectivity and tranquility. Designed for those who value space, privacy, and long-term appreciation, every plot here is a gateway to a secure future. With 100% legal clarity and NMRDA sanctioning, your investment is safe, secure, and poised for growth."}
                      </p>
                  </Reveal>

                  {/* PROJECT GALLERY SECTION - New */}
                  <Reveal>
                      <h3 className="text-3xl font-bold text-gray-900 mb-8 font-sans">Project Gallery</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(project.images && project.images.length > 0 ? project.images : ["/hero-image.png", "/hero-image.png"]).map((img: string, idx: number) => (
                              <div key={idx} className="rounded-2xl overflow-hidden aspect-video relative group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                                  <img 
                                      src={img} 
                                      alt={`Gallery ${idx}`} 
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                              </div>
                          ))}
                      </div>
                  </Reveal>

                  {/* Amenities */}
                  <Reveal>
                      <h3 className="text-3xl font-bold text-gray-900 mb-8 font-sans">World-Class Amenities</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                           {[
                                { title: "Cement Concrete Roads", desc: "Wide, durable internal roads." },
                                { title: "Underground Electricity", desc: "Clutter-free, safe power lines." },
                                { title: "24/7 Water Supply", desc: "Uninterrupted connectivity." },
                                { title: "Sewage Treatment Plant", desc: "Eco-friendly waste management." },
                                { title: "Lush Green Parks", desc: "Designed spaces for relaxation." },
                                { title: "Gated Security", desc: "24/7 guarded entry & exit." },
                                { title: "Kids Play Area", desc: "Safe zones for children." },
                                { title: "Modern Temple", desc: "Spiritual center within community." }
                           ].map((amenity, i) => (
                               <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-stone-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group">
                                   <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 transition-colors">
                                       <CheckCircle2 size={18} className="text-emerald-600 group-hover:text-white transition-colors" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-gray-900 mb-1">{amenity.title}</h4>
                                       <p className="text-sm text-gray-500">{amenity.desc}</p>
                                   </div>
                               </div>
                           ))}
                      </div>
                  </Reveal>
              </div>

              {/* RIGHT: Floating Booking Card */}
              <div className="lg:col-span-4">
                  <div className="sticky top-8">
                       <Reveal delay={200} className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                           {/* Decorative gradients */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                           <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                           <div className="relative z-10">
                               <h3 className="text-2xl font-bold mb-2">Interested in this property?</h3>
                               <p className="text-gray-400 mb-8 text-sm">Download the brochure or request a site visit.</p>


                               <form className="space-y-4 mb-8" onSubmit={async (e) => {
                                   e.preventDefault();
                                   const form = e.target as HTMLFormElement;
                                   const name = (form.querySelector('input[type="text"]') as HTMLInputElement).value;
                                   const mobile = (form.querySelector('input[type="tel"]') as HTMLInputElement).value;
                                   
                                   if(!name || !mobile) {
                                       toast.error("Please fill all fields");
                                       return;
                                   }

                                   try {
                                       const payload = {
                                           name,
                                           mobile,
                                           message: `Interested in Project: ${project?.projectName || "Unknown"}`,
                                           source: "website_project_detail",
                                           project: project?._id
                                       };
                                       
                                       const res = await divineSquareService.createInquiry(payload);
                                       if (res.status === 201 || res.statusCode === 201) {
                                           toast.success("Request sent successfully!");
                                           form.reset();
                                       } else {
                                            toast.error("Failed to send request.");
                                       }
                                   } catch (err) {
                                       toast.error("An error occurred");
                                   }
                               }}>
                                   <input type="text" placeholder="Your Name" className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" required />
                                   <input type="tel" placeholder="Phone Number" className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all" required />
                                   
                                   <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/80 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                       Request Site Visit
                                   </button>
                               </form>

                               <div className="grid grid-cols-2 gap-3">
                                   <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-sm transition-all">
                                      <Phone size={16} /> Call Now
                                   </button>
                                   <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-sm transition-all">
                                      <Download size={16} /> Brochure
                                   </button>
                               </div>

                               <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                   <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Managed By</p>
                                   <p className="font-serif text-lg italic text-white/80">Divine Square Infra</p>
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
// Helper icon
const TrendingUp = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
