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
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">  
            <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20 -ml-1"
            >
            <ArrowLeft className="w-5 h-5" />
            </button>
            
            <button
                onClick={() => navigate(`/leads/edit/${lead._id}`)}
                className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20 -ml-1 flex items-center justify-center p-0"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                  </svg>
              </div>
            </button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{lead.customerName}</h1>
            </div>
            <p className="text-primary-foreground/80">{lead.mobile}</p>
            {lead.email && (
              <p className="text-primary-foreground/60 text-sm mt-1">
                {lead.email}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-4 -mt-4 mb-4">
        <div className="crm-card !p-2 flex justify-around">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className={cn(
                "flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl transition-transform active:scale-95",
                action.color,
              )}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

       {/* Tabs */}
       <div className="px-4 mb-4">
           <div className="flex bg-muted p-1 rounded-xl">
               {['Overview', 'Quotations', 'Site Visits'].map((tab) => {
                   const tabKey = tab.toLowerCase().replace(" ", "_");
                   const isActive = activeTab === tabKey;
                   return (
                       <button
                           key={tab}
                           onClick={() => setActiveTab(tabKey)}
                           className={cn(
                               "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                               isActive ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"
                           )}
                       >
                           {tab}
                       </button>
                   );
               })}
           </div>
       </div>

      <main className="flex-1 px-4 space-y-4 pb-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <>
                {/* Lead Info */}
                <div className="crm-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                    Lead Information
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {/* Status & Source */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Share2 className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Source & Status</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground capitalize">{lead.leadSource?.name || "N/A"}</span>
                                <StatusBadge status={lead.leadStatus} />
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                           <Building2 className="w-4 h-4 text-blue-500" /> 
                        </div>
                         <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Requirements</p>
                            <p className="text-sm font-medium text-foreground capitalize">
                                {lead.lookingFor || "N/A"} • {lead.propertyType || "N/A"} • {lead.purpose || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground">
                            Interested Projects
                            </p>
                            <p className="text-sm font-medium text-foreground">
                            {lead.interestedProjects?.map((p: any) => p.projectName || p.name).join(", ") || lead.interestedProject?.projectName || "Not specified"}
                            </p>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <p className="text-sm font-medium text-foreground">
                            {lead.budget ? `₹${new Intl.NumberFormat('en-IN').format(lead.budget)}` : "Not specified"}
                            </p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-pink-500" />
                        </div>
                        <div className="flex-1">
                             <p className="text-xs text-muted-foreground">Looking Location</p>
                             <p className="text-sm font-medium text-foreground">{lead.lookingLocation || "N/A"}</p>
                        </div>
                    </div>

                    {/* Belongs From */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="flex-1">
                             <p className="text-xs text-muted-foreground">Belongs From</p>
                             <p className="text-sm font-medium text-foreground">{lead.belongsFrom || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {lead.notes && (
                    <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-foreground">{lead.notes}</p>
                    </div>
                )}
                </div>

                {/* Activity Timeline */}
                <div className="crm-card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">
                    Activity Timeline
                    </h3>
                    <button
                    onClick={() => navigate(`/tasks/new?leadId=${lead._id}`)}
                    className="touch-btn w-8 h-8 rounded-full bg-primary text-primary-foreground"
                    >
                    <Plus className="w-4 h-4" />
                    </button>
                </div>

                {tasksLoading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                    Loading activities...
                    </p>
                ) : timeline.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                    No activities yet. Add a task to get started.
                    </p>
                ) : (
                    <div className="space-y-4">
                    {timeline.map((item: any, index: number) => (
                        <div key={item.id} className="flex gap-3">   
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                            <div
                            className={cn(
                                "w-3 h-3 rounded-full border-2",
                                item.completed
                                ? "bg-primary border-primary"
                                : item.cancelled ? "bg-red-500 border-red-500" : "bg-card border-muted-foreground",
                            )}
                            />
                            {index < timeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-1" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between">
                            <div>
                                <p className={cn("text-sm font-bold text-foreground capitalize", item.cancelled && "line-through text-muted-foreground")}>
                                {item.title}
                                </p>
                                {item.remark && (
                                     <p className="text-xs text-muted-foreground mt-0.5">
                                         {item.remark}
                                     </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {!item.completed && !item.cancelled && (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (item.type === 'site_visit') {
                                                    navigate(`/site-visits/feedback/${item.id}`);
                                                } else {
                                                    navigate(`/tasks/complete/${item.id}`);
                                                }
                                            }}
                                            className="text-xs text-primary font-medium"
                                        >
                                            Done
                                        </button>
                                        <button
                                            onClick={() => handleCancelTask(item.id)}
                                            className="text-xs text-red-500 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {item.cancelled && <span className="text-xs text-red-500 font-medium">Cancelled</span>}
                            </div>
                            </div>

                            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </>
        )}

        {/* QUOTATIONS TAB */}
        {activeTab === 'quotations' && (
             <div className="crm-card">
             <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-semibold text-foreground">Quotations</h3>
                 <button
                        onClick={() => navigate(`/quotations/new?leadId=${lead._id}`)}
                        className="text-xs text-primary font-medium"
                 >
                        + Create
                 </button>
             </div>
             {quotations && quotations.length > 0 ? (
                 <div className="space-y-2">
                     {quotations.map((q) => (
                         <div key={q._id} className="flex items-center justify-between p-3 bg-muted rounded-xl" onClick={() => {
                                 // Construct backend URL dynamically based on current hostname
                                 const hostname = window.location.hostname;
                                 const protocol = window.location.protocol;
                                 const port = "5000"; // Assuming backend is always on 5000
                                 const baseUrl = `${protocol}//${hostname}:${port}`;
                                 window.open(baseUrl + q.pdfPath, "_blank");
                             }}>
                         <div>
                             <p className="text-sm font-medium">Plot {q.plotNo} ({q.projectName})</p>
                             <p className="text-xs text-muted-foreground">{q.area} sq.ft</p>
                         </div>
                         <div className="text-right flex flex-col items-end gap-1">
                             <p className="text-sm font-semibold text-primary">
                             ₹{(Number(q.finalTotalAmount) / 100000).toFixed(2)}L
                             </p>
                             <div className="flex items-center gap-3">
                                 <a href="#" className="text-[10px] text-green-600 font-bold underline">View PDF</a>
                                 <button
                                    onClick={(e) => handleShareQuotation(e, q)}
                                    className="p-1.5 bg-white text-green-600 rounded-full shadow-sm hover:bg-green-50 transition-colors border border-green-100"
                                    title="Share on WhatsApp"
                                 >
                                    <Share2 className="w-3.5 h-3.5" />
                                 </button>
                             </div>
                         </div>
                         </div>
                     ))}
                 </div>
             ) : (
                 <p className="text-sm text-muted-foreground text-center py-4">No quotations created yet.</p>
             )}
             </div>
        )}

        {/* SITE VISITS TAB */}
        {activeTab === 'site_visits' && (
            <div className="crm-card min-h-[50vh]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">Site Visits</h3>
                    <button
                        onClick={() => lead && navigate(`/site-visits/new?leadId=${lead._id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Schedule New
                    </button>
                </div>
                {taskByID && taskByID.filter((t: any) => t.taskType === "site_visit").length > 0 ? (
                    <div className="space-y-4">
                        {taskByID.filter((t: any) => t.taskType === "site_visit").map((visit: any) => (
                            <div key={visit._id} className="group relative bg-card rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                
                                <div className="p-4 pl-6 flex flex-col gap-3">
                                    {/* Top Row */}
                                    <div className="flex items-start justify-between">
                                         <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                  <Building2 className="w-6 h-6" />
                                             </div>
                                             <div>
                                                  <h4 className="font-bold text-base text-foreground leading-tight">
                                                    {visit.project?.projectName || visit.projectName || "Site Visit"}
                                                  </h4>
                                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                                                      <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {format(new Date(visit.scheduledAt || visit.taskDate), "MMM d, yyyy")}
                                                      </span>
                                                      <span className="w-1 h-1 rounded-full bg-border" />
                                                      <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {visit.taskTime}
                                                      </span>
                                                  </div>
                                             </div>
                                         </div>
                                         <StatusBadge status={visit.status} />
                                    </div>

                                    {/* Pickup Info - Condensed */}
                                    {visit.pickupLocation && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg w-fit">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate max-w-[250px]">{visit.pickupLocation}</span>
                                        </div>
                                    )}

                                    {/* Actions Row */}
                                    <div className="flex items-center justify-end gap-3 mt-1 pt-3 border-t border-border/50">
                                        <button 
                                            onClick={() => setSelectedVisit(visit)}
                                            className="text-xs font-semibold text-primary hover:underline underline-offset-4 flex items-center gap-1 mr-auto"
                                        >
                                            View Full Details <ChevronRight className="w-3 h-3" />
                                        </button>

                                        {visit.status !== 'completed' && visit.status !== 'cancelled' && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/site-visits/reschedule/${visit._id}`)}
                                                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                                                >
                                                    Reschedule
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/site-visits/feedback/${visit._id}`)}
                                                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm transition-all"
                                                >
                                                    Complete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ): (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border/60">
                         <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                             <MapPin className="w-8 h-8 text-muted-foreground/50" />
                         </div>
                        <h4 className="font-semibold text-foreground">No site visits yet</h4>
                        <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-[200px]">
                            Schedule a site visit to show properties to this lead.
                        </p>
                        <button
                            onClick={() => lead && navigate(`/site-visits/new?leadId=${lead._id}`)}
                            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Schedule Now
                        </button>
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
