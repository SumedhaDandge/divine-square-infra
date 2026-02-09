import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown, Meh, Camera, Check, Calendar, Users, MapPin, CheckCircle2, X, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useSubmitFeedback, useSiteVisits, useUploadImages } from "@/hooks/useSiteVisits";
import { useDataContext } from "@/contex/DataContext";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const interestLevels = [
  { value: "very_interested", label: "Very Interested", icon: ThumbsUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { value: "interested", label: "Interested", icon: ThumbsUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { value: "not_interested", label: "Not Interested", icon: ThumbsDown, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
];

export default function SiteVisitFeedback() {
  const navigate = useNavigate();
  const { id } = useParams();
  const submitFeedback = useSubmitFeedback();
  const { mutateAsync: uploadImages, isPending: isUploading } = useUploadImages();
  const { data: siteVisits } = useSiteVisits();
  const { projects } = useDataContext();
  const { fetchProjects } = useProjects();
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const siteVisit = siteVisits?.find((sv) => sv.id === id || sv._id === id);
  
  const [interestLevel, setInterestLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [layoutsVisited, setLayoutsVisited] = useState<string[]>([]);
  const [revisitDate, setRevisitDate] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const toggleLayout = (name: string) => {
      setLayoutsVisited(prev => 
          prev.includes(name) ? prev.filter(l => l !== name) : [...prev, name]
      );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const files = Array.from(e.target.files);
          setSelectedFiles(prev => [...prev, ...files]);
          const newPreviews = files.map(file => URL.createObjectURL(file));
          setPreviewImages(prev => [...prev, ...newPreviews]);
      }
  };

  const removeFile = (idx: number) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
      setPreviewImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !interestLevel) {
        toast.error("Please select an interest level");
        return;
    }

    try {
      let uploadedUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
          // Upload files first
          uploadedUrls = await uploadImages(selectedFiles);
      }

      await submitFeedback.mutateAsync({
        id,
        feedback: {
          interestLevel: interestLevel,
          notes: notes,
          attendeeCount: attendeeCount,
          layoutsVisited: layoutsVisited,
          revisitDate: revisitDate || undefined,
          images: uploadedUrls
        }
      });
      navigate(-1);
    } catch (error) {
       console.error(error);
       // Error handled by hooks
    }
  };

  if (!siteVisit) return (
      <AppShell showFab={false} showBottomNav={false}>
          <div className="flex items-center justify-center h-screen bg-slate-50">
              <Loader2 className="animate-spin w-8 h-8 text-amber-500" />
          </div>
      </AppShell>
  );

  return (
    <AppShell showFab={false} showBottomNav={false}>
      {/* 
        Main Layout: Fixed Header + Scrollable Body + Fixed Footer 
        Using h-[100dvh] ensures it fits mobile viewports correctly including address bar.
      */}
      <div className="flex flex-col h-[100dvh] bg-slate-50 relative">
         
         {/* Fixed Header */}
         <div className="flex-none bg-white/80 backdrop-blur-md border-b border-border z-20 px-4 h-14 flex items-center gap-3 shadow-sm">
             <button 
                onClick={() => navigate(-1)} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                type="button"
             >
                 <ArrowLeft className="w-5 h-5 text-slate-700" />
             </button>
             <div>
                 <h1 className="text-sm font-bold text-slate-800">Feedback</h1>
                 <p className="text-[10px] text-muted-foreground font-medium">{siteVisit.leads?.customerName}</p>
             </div>
         </div>

         {/* Scrollable Content Area */}
         <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
             
             {/* Project Info Card */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-start gap-3">
                 <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                     <MapPin className="w-5 h-5 text-blue-600" />
                 </div>
                 <div className="flex-1 min-w-0">
                     <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Project Visit</p>
                     <h2 className="text-sm font-bold text-slate-800 truncate">{siteVisit.project?.projectName || "Divine Square Project"}</h2>
                     <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(siteVisit.scheduledAt || siteVisit.taskDate).toLocaleDateString(undefined, {
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                        })}
                     </p>
                 </div>
             </div>

             <div className="space-y-6">
                
                {/* Interest Level */}
                <section>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block pl-1">
                        Client Interest <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {interestLevels.map((level) => (
                            <button 
                                key={level.value}
                                onClick={() => setInterestLevel(level.value)}
                                type="button"
                                className={cn(
                                    "relative flex flex-col items-center justify-center py-4 px-2 gap-2 rounded-xl border-2 transition-all duration-200",
                                    interestLevel === level.value 
                                        ? `${level.bg || 'bg-slate-50'} ${level.border || 'border-slate-200'} scale-[1.02] shadow-sm` 
                                        : "bg-white border-transparent hover:border-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                    interestLevel === level.value ? "bg-white" : "bg-slate-100"
                                )}>
                                    <level.icon className={cn("w-4 h-4", interestLevel === level.value ? level.color : "text-slate-400")} />
                                </div>
                                <span className={cn("text-xs font-bold text-center leading-tight", interestLevel === level.value ? "text-slate-800" : "text-slate-500")}>{level.label}</span>
                                
                                {interestLevel === level.value && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 className={cn("w-4 h-4", level.color)} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Data Inputs */}
                <section className="grid grid-cols-2 gap-3">
                    {/* Visitors */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Visitors</label>
                        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-1">
                            <button type="button" onClick={() => setAttendeeCount(Math.max(1, attendeeCount - 1))} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-700 hover:text-primary active:scale-95 transition-all font-bold text-lg">-</button>
                            <span className="text-sm font-bold text-slate-800 w-6 text-center">{attendeeCount}</span>
                            <button type="button" onClick={() => setAttendeeCount(attendeeCount + 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-700 hover:text-primary active:scale-95 transition-all font-bold text-lg">+</button>
                        </div>
                    </div>

                    {/* Revisit */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Revisit Date</label>
                        <input 
                            type="date"
                            value={revisitDate}
                            onChange={(e) => setRevisitDate(e.target.value)}
                            className="w-full bg-slate-50 rounded-lg h-10 px-2 text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-primary/50"
                        />
                    </div>
                </section>

                {/* Visited Details */}
                <section>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block pl-1">Layouts Visited</label>
                    <div className="flex flex-wrap gap-2">
                         {projects?.map((p: any) => {
                            const isSelected = layoutsVisited.includes(p.projectName || p.name);
                            return (
                                <button
                                    key={p.id || p._id}
                                    onClick={() => toggleLayout(p.projectName || p.name)}
                                    type="button"
                                    className={cn(
                                        "px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5",
                                        isSelected
                                            ? "bg-slate-800 text-white border-slate-800 shadow-sm" 
                                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    )}
                                >
                                    {isSelected && <Check className="w-3 h-3" />}
                                    {p.projectName || p.name}
                                </button>
                            )
                         })}
                    </div>
                </section>

                {/* Photos */}
                <section>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block pl-1">Photos</label>
                    <div className="grid grid-cols-4 gap-2">
                        <label className="aspect-square flex flex-col items-center justify-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-200 hover:border-slate-300 transition-colors active:scale-95">
                            <Camera className="w-5 h-5 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Add</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                        </label>
                        {previewImages.map((src, idx) => (
                            <div key={idx} className="aspect-square relative rounded-xl overflow-hidden shadow-sm bg-white">
                                <img src={src} className="w-full h-full object-cover" alt="preview" />
                                <button 
                                    onClick={() => removeFile(idx)}
                                    type="button" 
                                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notes */}
                <section>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block pl-1">Feedback Summary</label>
                    <textarea
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-28 p-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary/10 shadow-sm resize-none placeholder:text-slate-400 placeholder:text-xs"
                        placeholder="Enter detailed feedback, customer objections, or follow-up notes..."
                    />
                </section>

             </div>
         </div>

         {/* Fixed Footer */}
         <div className="flex-none p-4 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-30 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
             <div className="max-w-md mx-auto w-full">
                  <button 
                      onClick={handleSubmit} 
                      disabled={!interestLevel || submitFeedback.isPending || isUploading}
                      type="button"
                      className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 text-sm"
                  >
                      {isUploading ? (
                          <>
                             <Loader2 className="w-4 h-4 animate-spin" />
                             Uploading Photos...
                          </>
                      ) : submitFeedback.isPending ? (
                          <>
                             <Loader2 className="w-4 h-4 animate-spin" />
                             Saving...
                          </>
                      ) : (
                          "Complete Feedback"
                      )}
                  </button>
             </div>
         </div>
         
      </div>
    </AppShell>
  );
}
