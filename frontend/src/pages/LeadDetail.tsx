import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Plus,
  ChevronRight,
  Building2,
  Wallet,
  Loader2,
  Share2,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { useLead, LeadStatus } from "@/hooks/useLeads";
// import { useLeadTasks } from "@/hooks/useTasks";
// import { useLeadSiteVisits } from "@/hooks/useSiteVisits";
import { useLeadQuotations } from "@/hooks/useQuotations";
import { toast } from "sonner";
import { format } from "date-fns";
import useLeads from "@/hooks/useLeads";
import { useDataContext } from "@/contex/DataContext";
import { useEffect, useState } from "react";
import useLeadTasks from "@/hooks/useLeadTasks";

const getDisplayStatus = (
  status: any,
): "hot" | "warm" | "cold" | "new" | "converted" => {
  const mapping: Record<any, "hot" | "warm" | "cold" | "new" | "converted"> = {
    new: "new",
    contacted: "warm",
    qualified: "warm",
    negotiation: "hot",
    won: "converted",
    lost: "cold",
  };
  return mapping[status];
};

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function LeadDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { leads } = useDataContext();
  const lead = leads.find((l: any) => l._id === id || l.id === id);
  const { fetchLeads, isLoading } = useLeads();
  const { data: quotations } = useLeadQuotations(lead?._id || "");
  const { getTaskByID, tasksLoading, cancelTask } = useLeadTasks();
  const { taskByID } = useDataContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);

  console.log("Lead Detail Rendered for ID:", id, "Lead Found:", !!lead);

  useEffect(() => {
    if(!leads || leads.length === 0) {
        fetchLeads();
    }
  }, [id]);

  useEffect(() => {
      if (lead?._id) {
          getTaskByID(lead._id);
      }
  }, [lead?._id]);

  // Combine all activities into timeline
  const timeline =
    taskByID
      ?.map((t: any) => ({
        id: t._id,
        type: t.taskType,
        title: t.title || t.taskType?.replace(/_/g, " "), // Default to task type if no title
        remark: t.remark,
        scheduledAt: t.scheduledAt,
        time: (() => {
            const d = new Date(t.scheduledAt || t.taskDate || t.taskTime);
            return !isNaN(d.getTime()) ? format(d, "MMM d, h:mm a") : "No date";
        })(),
        status: t.status,
        completed: t.status === "completed",
        cancelled: t.status === "cancelled",
        sortDate: (() => {
             const d = new Date(t.scheduledAt || t.taskDate || t.taskTime);
             return !isNaN(d.getTime()) ? d : new Date();
        })(),
      }))
      .sort((a: any, b: any) => b.sortDate.getTime() - a.sortDate.getTime()) ||
    [];

  const handleCancelTask = async (taskId: string) => {
    if (confirm("Are you sure you want to cancel this task?")) {
        await cancelTask(taskId, lead?._id);
        toast.success("Task cancelled");
    }
  };

  const quickActions = [
    {
      icon: Phone,
      label: "Call",
      color: "bg-primary text-primary-foreground",
      action: () => lead && window.open(`tel:${lead.mobile}`),
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      color: "bg-status-hot text-white",
      action: () =>
        lead && window.open(`https://wa.me/${lead.mobile?.replace(/\s/g, "")}`),
    },
    {
      icon: MapPin,
      label: "Site Visit",
      color: "bg-accent text-accent-foreground",
      action: () => lead && navigate(`/site-visits/new?leadId=${lead._id}`),
    },
    {
      icon: FileText,
      label: "Quote",
      color: "bg-status-cold text-white",
      action: () => lead && navigate(`/quotations/new?leadId=${lead._id}`),
    },
  ];

  if (isLoading) {
    return (
      <AppShell showFab={false}>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!lead) {
    return (
      <AppShell showFab={false}>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-lg font-semibold mb-2">Lead Not Found</h2>
          <button
            onClick={() => navigate("/leads")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl"
          >
            Back to Leads
          </button>
        </div>
      </AppShell>
    );
  }

  const handleShareQuotation = async (e: React.MouseEvent, q: any) => {
    e.stopPropagation();
    if (!lead) return;

    // Construct backend URL dynamically based on current hostname
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = "5000"; // Assuming backend is always on 5000
    const baseUrl = `${protocol}//${hostname}:${port}`;
    const pdfUrl = `${baseUrl}${q.pdfPath}`;
    
    const message = `Hello ${lead.customerName}, Here is the quotation for ${q.projectName || 'Project'} Plot ${q.plotNo}.`;

    try {
        // 1. Try to share the file directly if supported
        if (navigator.share) {
            toast.loading("Preparing PDF for sharing...");
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const file = new File([blob], `Quotation_${q.plotNo}.pdf`, { type: "application/pdf" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Quotation PDF',
                    text: message,
                });
                toast.dismiss();
                toast.success("Shared successfully");
                return;
            }
        }
        throw new Error("File sharing not supported");
    } catch (error) {
        // 2. Fallback to WhatsApp Link if file sharing fails
        toast.dismiss();
        console.warn("File sharing failed, falling back to link:", error);
        
        // Include the link in the message for fallback
        const fallbackMessage = `${message} \n\nYou can view it here: ${pdfUrl}`;
        const whatsappUrl = `https://wa.me/${lead.mobile?.replace(/\D/g, "")}?text=${encodeURIComponent(fallbackMessage)}`;
        window.open(whatsappUrl, "_blank");
    }
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified";
    const formatVal = (val: number) => {
      if (val >= 100) return `${(val / 100).toFixed(1)}Cr`;
      return `${val}L`;
    };
    if (min && max) return `₹${formatVal(min)} - ${formatVal(max)}`;
    if (min) return `From ₹${formatVal(min)}`;
    if (max) return `Up to ₹${formatVal(max)}`;
    return "Not specified";
  };

  return (
    <AppShell showFab={false}>
      {/* Header */}
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 pb-2 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">  
            <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
            <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
                 <button
                    onClick={() => navigate(`/leads/edit/${lead._id}`)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                    </svg>
                </button>
            </div>
        </div>

        <div className="px-4 pb-4">
            <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-2xl font-bold text-foreground leading-tight mb-1">{lead.customerName}</h1>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        {lead.mobile}
                   </div>
                </div>
                <StatusBadge status={lead.leadStatus} className="px-3 py-1 text-xs" />
            </div>

             {/* Quick Actions Row */}
             <div className="grid grid-cols-4 gap-2 mt-4">
                {quickActions.map((action) => (
                    <button
                        key={action.label}
                        onClick={action.action}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1.5 py-2 rounded-xl border transition-all active:scale-95",
                            action.label === 'Call' ? "bg-primary/5 border-primary/20 text-primary" :
                            action.label === 'WhatsApp' ? "bg-green-50 border-green-200 text-green-600" :
                            "bg-card border-border/50 text-muted-foreground hover:bg-muted"
                        )}
                    >
                        <action.icon className="w-4 h-4" />
                        <span className="text-[10px] font-medium">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
            <div className="flex p-1 bg-muted/50 rounded-xl relative">
                {['Overview', 'Timeline', 'Quotations', 'Site Visits'].map((tab) => {
                    const tabKey = tab.toLowerCase().replace(" ", "_");
                    const isActive = activeTab === tabKey;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tabKey)}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all z-10 relative",
                                isActive ? "text-primary bg-background shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[270px]" />

      <main className="px-4 pb-24 space-y-4">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Key Details Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-card rounded-2xl border border-border/50 shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Wallet className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Budget</span>
                        </div>
                        <p className="font-semibold text-foreground">
                            {lead.budget ? `₹${new Intl.NumberFormat('en-IN').format(lead.budget)}` : "Not set"}
                        </p>
                    </div>
                    <div className="p-3 bg-card rounded-2xl border border-border/50 shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Location</span>
                        </div>
                        <p className="font-semibold text-foreground truncate">
                            {lead.lookingLocation || "Any"}
                        </p>
                    </div>
                </div>

                {/* Requirements Section */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" /> Properties of Interest
                    </h3>
                    <div className="space-y-3">
                         <div>
                            <span className="text-xs text-muted-foreground block mb-1">Looking For</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-primary/5 text-primary text-xs font-medium rounded-md border border-primary/10">
                                    {lead.lookingFor || "Apartment"}
                                </span>
                                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-md">
                                    {lead.propertyType || "2 BHK"}
                                </span>
                            </div>
                         </div>
                         <div>
                            <span className="text-xs text-muted-foreground block mb-1">Interested Projects</span>
                            <p className="text-sm font-medium">
                                {lead.interestedProjects?.map((p: any) => p.projectName || p.name).join(", ") || lead.interestedProject?.projectName || "Not specified"}
                            </p>
                         </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4">
                     <h3 className="text-sm font-semibold text-foreground mb-3">Additional Info</h3>
                     <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                             <span className="text-xs text-muted-foreground block">Source</span>
                             <span className="text-sm font-medium">{lead.leadSource?.name || "N/A"}</span>
                        </div>
                        <div>
                             <span className="text-xs text-muted-foreground block">Belongs From</span>
                             <span className="text-sm font-medium">{lead.belongsFrom || "N/A"}</span>
                        </div>
                        <div className="col-span-2">
                             <span className="text-xs text-muted-foreground block mb-1">Notes</span>
                             <p className="text-sm text-foreground/80 bg-muted/30 p-2 rounded-lg leading-relaxed">
                                {lead.notes || "No notes available."}
                             </p>
                        </div>
                     </div>
                </div>
            </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-foreground">Activity Log</h3>
                    <button
                        onClick={() => navigate(`/tasks/new?leadId=${lead._id}`)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-sm hover:opacity-90 transition-all"
                    >
                        + Add Task
                    </button>
                </div>

                {timeline.length === 0 ? (
                    <div className="text-center py-8">
                        <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No activity history yet.</p>
                    </div>
                ) : (
                    <div className="relative pl-4 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
                         {timeline.map((item: any) => (
                             <div key={item.id} className="relative pl-6">
                                  {/* Dot */}
                                  <div className={cn(
                                      "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center z-10",
                                      item.completed ? "bg-green-500" : item.cancelled ? "bg-red-500" : "bg-primary"
                                  )}>
                                      {item.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>

                                  <div className="flex flex-col gap-1">
                                      <div className="flex justify-between items-start">
                                          <p className={cn("text-sm font-semibold text-foreground capitalize", item.cancelled && "line-through text-muted-foreground")}>
                                              {item.title}
                                          </p>
                                          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                              {item.time}
                                          </span>
                                      </div>
                                      
                                      {item.remark && (
                                          <p className="text-xs text-muted-foreground/80 leading-snug">
                                              {item.remark}
                                          </p>
                                      )}

                                      {/* Actions */}
                                      {!item.completed && !item.cancelled && (
                                          <div className="flex gap-3 mt-2">
                                              <button 
                                                onClick={() => {
                                                    if (item.type === 'site_visit') {
                                                        navigate(`/site-visits/feedback/${item.id}`);
                                                    } else {
                                                        navigate(`/tasks/complete/${item.id}`);
                                                    }
                                                }}
                                                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide"
                                              >
                                                  Mark Done
                                              </button>
                                              <button 
                                                onClick={() => handleCancelTask(item.id)}
                                                className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-wide"
                                              >
                                                  Cancel
                                              </button>
                                          </div>
                                      )}
                                  </div>
                             </div>
                         ))}
                    </div>
                )}
            </div>
        )}

        {/* QUOTATIONS TAB */}
        {activeTab === 'quotations' && (
             <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-end">
                 <button
                        onClick={() => navigate(`/quotations/new?leadId=${lead._id}`)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-sm"
                 >
                        Create New
                 </button>
             </div>
             {quotations && quotations.length > 0 ? (
                 <div className="grid grid-cols-1 gap-3">
                     {quotations.map((q) => (
                         <div key={q._id} className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex flex-col gap-3" onClick={() => {
                                 // Construct backend URL
                                 const hostname = window.location.hostname;
                                 const protocol = window.location.protocol;
                                 const port = "5000"; 
                                 const baseUrl = `${protocol}//${hostname}:${port}`;
                                 window.open(baseUrl + q.pdfPath, "_blank");
                             }}>
                             <div className="flex justify-between items-start">
                                 <div>
                                     <h4 className="font-bold text-foreground">Plot {q.plotNo}</h4>
                                     <p className="text-xs text-muted-foreground">{q.projectName}</p>
                                 </div>
                                 <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-100">
                                     Final
                                 </span>
                             </div>
                             
                             <div className="flex items-end justify-between pt-2 border-t border-dashed border-border/50">
                                 <div>
                                     <span className="text-[10px] text-muted-foreground block">Total Amount</span>
                                     <span className="text-lg font-bold text-primary">₹{(Number(q.finalTotalAmount) / 100000).toFixed(2)}L</span>
                                 </div>
                                 <div className="flex gap-2">
                                     <button
                                         onClick={(e) => { e.stopPropagation(); handleShareQuotation(e, q); }}
                                         className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                     >
                                         <Share2 className="w-4 h-4" />
                                     </button>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
                     <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
                     <p className="text-sm text-muted-foreground">No quotations created yet.</p>
                 </div>
             )}
             </div>
        )}

        {/* SITE VISITS TAB */}
        {activeTab === 'site_visits' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Visits</h3>
                    <button
                        onClick={() => lead && navigate(`/site-visits/new?leadId=${lead._id}`)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-sm"
                    >
                        + Schedule
                    </button>
                </div>
                {taskByID && taskByID.filter((t: any) => t.taskType === "site_visit").length > 0 ? (
                    <div className="space-y-3">
                        {taskByID.filter((t: any) => t.taskType === "site_visit").map((visit: any) => (
                            <div key={visit._id} className="group bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 flex gap-4">
                                     {/* Date Box */}
                                     <div className="flex flex-col items-center justify-center w-14 h-14 bg-muted/30 rounded-xl border border-border/50 shrink-0">
                                         <span className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(visit.scheduledAt || visit.taskDate), "MMM")}</span>
                                         <span className="text-xl font-bold text-foreground">{format(new Date(visit.scheduledAt || visit.taskDate), "d")}</span>
                                     </div>

                                     <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-start mb-1">
                                              <h4 className="font-bold text-base text-foreground truncate">
                                                {visit.project?.projectName || visit.projectName || "Site Visit"}
                                              </h4>
                                              <StatusBadge status={visit.status} className="scale-90 origin-right" />
                                          </div>
                                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                              <Clock className="w-3.5 h-3.5" /> {visit.taskTime}
                                              {visit.pickupLocation && (
                                                  <>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span className="truncate max-w-[120px]">{visit.pickupLocation}</span>
                                                  </>
                                              )}
                                          </p>
                                     </div>
                                </div>
                                
                                <div className="bg-muted/20 px-4 py-2 flex items-center justify-between border-t border-border/50">
                                      <button 
                                          onClick={() => setSelectedVisit(visit)} 
                                          className="text-xs font-medium text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                                      >
                                          Details <ChevronRight className="w-3 h-3" />
                                      </button>
                                      
                                      {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                                          <div className="flex gap-3">
                                               <button onClick={() => navigate(`/site-visits/reschedule/${visit._id}`)} className="text-xs font-medium text-foreground hover:underline">Reschedule</button>
                                               <button onClick={() => navigate(`/site-visits/feedback/${visit._id}`)} className="text-xs font-bold text-primary hover:underline">Complete</button>
                                          </div>
                                      )}
                                </div>
                            </div>
                        ))}
                    </div>
                ): (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
                         <MapPin className="w-10 h-10 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">No site visits scheduled.</p>
                    </div>
                )}
            </div>
        )}
      </main>

      {/* Image Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* Site Visit Details Sheet */}
      <Sheet open={!!selectedVisit} onOpenChange={(open) => !open && setSelectedVisit(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col h-full rounded-l-2xl border-l border-border bg-background">
           {selectedVisit && (
               <>
                {/* Header */}
                <div className="p-6 pb-2 shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                             <SheetTitle className="text-lg font-bold leading-tight">
                                {selectedVisit.project?.projectName || selectedVisit.projectName || "Site Visit"}
                             </SheetTitle>
                             <SheetDescription>
                                {format(new Date(selectedVisit.scheduledAt || selectedVisit.taskDate), "EEEE, MMM d, yyyy")} • {selectedVisit.taskTime}
                             </SheetDescription>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <StatusBadge status={selectedVisit.status} />
                        {selectedVisit.status !== 'completed' && selectedVisit.status !== 'cancelled' && (
                             <div className="flex gap-2">
                                <button onClick={() => navigate(`/site-visits/reschedule/${selectedVisit._id}`)} className="text-xs font-medium text-foreground underline decoration-dotted">Reschedule</button>
                                <div className="w-[1px] h-4 bg-border" />
                                <button onClick={() => navigate(`/site-visits/feedback/${selectedVisit._id}`)} className="text-xs font-bold text-primary hover:underline">Complete Mark</button>
                             </div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Scrollable Body */}
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                        
                        {/* Pickup Section */}
                        {selectedVisit.pickupLocation && (
                             <section>
                                 <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Logistics</h4>
                                 <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl border border-border/50">
                                     <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                     <div>
                                         <span className="text-xs text-muted-foreground block mb-0.5">Pickup Location</span>
                                         <p className="text-sm font-medium text-foreground leading-normal">{selectedVisit.pickupLocation}</p>
                                     </div>
                                 </div>
                             </section>
                        )}

                        {/* Feedback Section */}
                        {selectedVisit.status === 'completed' && (
                            <section>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                    Visit Feedback
                                    {selectedVisit.feedback?.interestLevel && (
                                        <span className={cn(
                                            "ml-auto px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                                            selectedVisit.feedback.interestLevel === 'very_interested' ? "bg-green-100 text-green-700" :
                                            selectedVisit.feedback.interestLevel === 'interested' ? "bg-blue-100 text-blue-700" :
                                            selectedVisit.feedback.interestLevel === 'not_interested' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                                        )}>
                                            {selectedVisit.feedback.interestLevel.replace("_", " ")}
                                        </span>
                                    )}
                                </h4>
                                
                                <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-4">
                                     {/* Layouts */}
                                     {selectedVisit.feedback?.layoutsVisited?.length > 0 && (
                                         <div>
                                             <span className="text-xs text-muted-foreground block mb-2">Layouts Visited</span>
                                             <div className="flex flex-wrap gap-2">
                                                 {selectedVisit.feedback.layoutsVisited.map((l: string, i: number) => (
                                                     <span key={i} className="px-2.5 py-1 bg-background border border-border rounded-md text-xs font-medium">
                                                         {l}
                                                     </span>
                                                 ))}
                                             </div>
                                         </div>
                                     )}

                                     {/* Notes */}
                                     {selectedVisit.feedback?.notes && (
                                         <div>
                                             <span className="text-xs text-muted-foreground block mb-1">Notes</span>
                                             <p className="text-sm italic text-foreground/80 leading-relaxed">
                                                 "{selectedVisit.feedback.notes}"
                                             </p>
                                         </div>
                                     )}

                                    {/* Images */}
                                    {selectedVisit.feedback?.images?.length > 0 && (
                                        <div>
                                            <span className="text-xs text-muted-foreground block mb-2">Photos ({selectedVisit.feedback.images.length})</span>
                                            <div className="grid grid-cols-3 gap-2">
                                                {selectedVisit.feedback.images.map((img: string, idx: number) => (
                                                    <div 
                                                        key={idx} 
                                                        className="aspect-square rounded-lg overflow-hidden border border-border bg-background cursor-zoom-in hover:brightness-110 active:scale-95 transition-all"
                                                        onClick={() => setSelectedImage(img)}
                                                    >
                                                        <img src={img} alt={`Visit img ${idx}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* History Timeline */}
                        <section>
                             <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">History & Timeline</h4>
                             <div className="relative pl-2 border-l-2 border-border/60 space-y-6">
                                 
                                 {/* Created */}
                                 <div className="relative pl-6">
                                     <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border ring-4 ring-background" />
                                     <p className="text-sm font-medium text-foreground">Visit Scheduled</p>
                                     <p className="text-xs text-muted-foreground">Original date: {format(new Date(selectedVisit.createdAt || selectedVisit.taskDate), "MMM d, yyyy")}</p>
                                 </div>

                                 {/* Reschedules */}
                                 {selectedVisit.rescheduleHistory?.map((h: any, idx: number) => (
                                     <div key={idx} className="relative pl-6">
                                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-200 ring-4 ring-background" />
                                          <p className="text-sm font-medium text-amber-900">Rescheduled</p>
                                          <p className="text-xs text-muted-foreground mb-1">Changed to: {format(new Date(h.scheduledAt), "MMM d, h:mm a")}</p>
                                          {h.reason && (
                                             <div className="text-xs bg-amber-50 text-amber-800/80 px-2 py-1 rounded inline-block">
                                                 Reason: {h.reason}
                                             </div>
                                          )}
                                     </div>
                                 ))}

                                 {/* Current Status */}
                                 <div className="relative pl-6">
                                      <div className={cn(
                                          "absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-background",
                                          selectedVisit.status === 'completed' ? "bg-green-500" : 
                                          selectedVisit.status === 'cancelled' ? "bg-red-500" : "bg-primary"
                                      )} />
                                      <p className="text-sm font-medium text-foreground capitalize">
                                          {selectedVisit.status === 'completed' ? "Visit Completed" : 
                                           selectedVisit.status === 'cancelled' ? "Visit Cancelled" : "Currently Scheduled"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                          {format(new Date(selectedVisit.updatedAt || selectedVisit.taskDate), "MMM d, h:mm a")}
                                      </p>
                                 </div>

                             </div>
                        </section>

                    </div>
                </ScrollArea>
               </>
           )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
