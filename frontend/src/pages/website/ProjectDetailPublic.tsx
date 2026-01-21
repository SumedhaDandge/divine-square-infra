
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useDataContext } from "@/contex/DataContext";
import { MapPin, CheckCircle2, Calendar, Phone, Download, ArrowLeft, Ruler, Home, Trees, Shield, IndianRupee, FileCheck, Landmark } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50/50">
      
      {/* HEADER SECTION - Clean & Minimal */}
      <div className="relative pt-32 pb-12 bg-white border-b border-gray-100">
          <div className="container px-4">
              <Link to="/projects-public" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors text-sm font-medium group">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to All Projects
              </Link>
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                  <Reveal>
                       <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                              project.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                              "bg-amber-50 text-amber-600 border-amber-100"
                          )}>
                              {project.status}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                             <Shield size={12} /> RERA Approved
                          </span>
                       </div>
                       <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">{project.projectName}</h1>
                       <p className="flex items-center gap-2 text-xl text-gray-500 font-medium">
                          <MapPin className="text-primary w-5 h-5"/> {project.location}
                       </p>
                  </Reveal>

                  <Reveal delay={100} className="lg:text-right">
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Starting From</p>
                      <p className="text-4xl font-bold text-primary">
                          ₹{project.priceRange?.min ? (project.priceRange.min / 100000).toFixed(1) : "??"}<span className="text-2xl text-gray-400 font-medium"> Lakhs*</span>
                      </p>
                  </Reveal>
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="container px-4 py-12">
          <div className="grid lg:grid-cols-12 gap-12">
              
              {/* LEFT COLUMN - CONTENT */}
              <div className="lg:col-span-8 space-y-12">
                  
                  {/* IMAGE GALLERY SECTION */}
                   <Reveal className="space-y-4">
                       <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-video relative group bg-gray-100">
                           <img 
                                src={selectedImage || "/hero-image.png"} 
                                alt={project.projectName} 
                                className="w-full h-full object-cover transition-all duration-500" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>

                       {/* Thumbnails */}
                       <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                           {(project.images && project.images.length > 0 ? project.images : ["/hero-image.png", "/hero-image.png", "/hero-image.png", "/hero-image.png"]).map((img: string, idx: number) => (
                               <button 
                                   key={idx}
                                   onClick={() => setSelectedImage(img)}
                                   className={cn(
                                       "flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all snap-start",
                                       selectedImage === img ? "border-primary shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                                   )}
                               >
                                   <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                               </button>
                           ))}
                       </div>
                   </Reveal>

                  {/* KEY HIGHLIGHTS - Modern Cards */}
                  <Reveal delay={100}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                              { label: "Plot Area", value: "1000+ sqft", icon: <Ruler className="w-5 h-5"/> },
                              { label: "Total Units", value: project.totalUnits, icon: <Home className="w-5 h-5"/> },
                              { label: "Possession", value: "Immediate", icon: <Calendar className="w-5 h-5"/> },
                              { label: "Legal", value: "Clear Title", icon: <FileCheck className="w-5 h-5"/> },
                          ].map((stat, i) => (
                              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:border-primary/30 transition-colors shadow-sm">
                                  <div className="w-10 h-10 mx-auto bg-gray-50 text-gray-600 rounded-full flex items-center justify-center mb-3">
                                      {stat.icon}
                                  </div>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                              </div>
                          ))}
                      </div>
                  </Reveal>

                  {/* ABOUT SECTION */}
                  <Reveal delay={200} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">About the Project</h3>
                      <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
                          <p>{project.description || "Discover a lifestyle of convenience and luxury. This premium layout offers thoughtfully designed plots in a rapidly developing neighborhood. With excellent connectivity to schools, hospitals, and markets, it is the perfect location to build your dream home or for a high-return investment."}</p>
                      </div>
                  </Reveal>

                  {/* AMENITIES - Simple List */}
                  <Reveal delay={300}>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">Amenities & Features</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                          {["Cement Concrete Roads", "Underground Electricity", "24/7 Water Supply", "Sewage Line", "Lush Green Parks", "Street Lights", "Gated Security", "Compound Wall", "Kids Play Area", "Temple"].map((item, i) => (
                              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:border-primary/30 transition-colors shadow-sm">
                                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                      <CheckCircle2 size={14} className="text-emerald-600" />
                                  </div>
                                  <span className="font-medium text-gray-700">{item}</span>
                              </div>
                          ))}
                      </div>
                  </Reveal>

              </div>

              {/* RIGHT COLUMN - SIDEBAR CTA */}
              <div className="lg:col-span-4">
                  <div className="sticky top-28 space-y-6">
                      <Reveal delay={400} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                          <div className="text-center mb-8">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">Interested?</h3>
                              <p className="text-gray-500 text-sm">Fill the form to recieve brochure and pricing details.</p>
                          </div>
                          
                          <form className="space-y-4">
                              <div className="space-y-1.5">
                                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Your Name</label>
                                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium" />
                              </div>
                              <div className="space-y-1.5">
                                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                                  <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium" />
                              </div>
                              
                              <button type="submit" className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 active:translate-y-0 mt-2">
                                  Get Callback
                              </button>
                          </form>
                          
                          <div className="mt-8 pt-8 border-t border-dashed border-gray-200 flex flex-col gap-3">
                               <a href="tel:+918767160868" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary/10 transition-all">
                                  <Phone size={18} /> Call Sales Team
                               </a>
                               <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">
                                  <Download size={18} /> Download Brochure
                               </button>
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
