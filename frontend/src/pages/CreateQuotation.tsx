
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2, ChevronDown, Calculator, FileText, Calendar as CalendarIcon, Share2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateQuotation } from "@/hooks/useQuotations";
import useLeads from "@/hooks/useLeads";
import { useProjects } from "@/hooks/useProjects";
import { useDataContext } from "@/contex/DataContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreateQuotation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get("leadId");
  
  const createQuotation = useCreateQuotation();
  const { leads, projects } = useDataContext();
  const { fetchLeads } = useLeads();
  const { fetchProjects } = useProjects();

  useEffect(() => {
    fetchLeads();
    fetchProjects();
  }, []);
  
  const [formData, setFormData] = useState({
    lead_id: leadIdParam || "",
    project_id: "",
    plot_no: "",
    area: "",
    rate: "",
    downPayment: "",
    registryAmount: "",
    stampDuty: "",
    miscellaneous: "",
    valid_until: new Date(),
    terms: "",
  });
  
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const selectedLead = leads?.find((l) => l.id === formData.lead_id || l._id === formData.lead_id);
  const selectedProject = projects?.find((p) => p.id === formData.project_id || p._id === formData.project_id);

  const calculations = useMemo(() => {
    const area = parseFloat(formData.area) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const basicCost = area * rate;
    
    const downPayment = parseFloat(formData.downPayment) || 0;
    const balanceAmount = basicCost - downPayment;
    
    const registry = parseFloat(formData.registryAmount) || 0;
    const stamp = parseFloat(formData.stampDuty) || 0;
    const misc = parseFloat(formData.miscellaneous) || 0;
    
    const finalPrice = basicCost + registry + stamp + misc;
    
    return { basicCost, balanceAmount, finalPrice };
  }, [formData]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lead_id || !formData.plot_no) {
      toast.error("Please select a lead and enter plot no");
      return;
    }

    try {
      await createQuotation.mutateAsync({
        lead: formData.lead_id,
        projectName: selectedProject?.projectName,
        plotNo: formData.plot_no,
        area: parseFloat(formData.area) || 0,
        rate: parseFloat(formData.rate) || 0,
        downPayment: parseFloat(formData.downPayment) || 0,
        registryAmount: parseFloat(formData.registryAmount) || 0,
        stampDuty: parseFloat(formData.stampDuty) || 0,
        miscellaneous: parseFloat(formData.miscellaneous) || 0,
      });
      
      navigate(-1);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <AppShell showFab={false} showBottomNav={false}>
      <header className="bg-status-cold text-white px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="touch-btn w-10 h-10 rounded-full bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Create Quotation</h1>
            <p className="text-sm opacity-70">Generate a price quote</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
        {/* Lead Selection */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">Select Lead *</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLeadDropdown(!showLeadDropdown)}
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {selectedLead ? selectedLead.customerName : <span className="text-muted-foreground">Select a lead</span>}
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showLeadDropdown && "rotate-180")} />
            </button>
            {showLeadDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                {leads?.map((lead) => (
                  <button
                    key={lead._id || lead.id}
                    type="button"
                    onClick={() => {
                        setFormData({ ...formData, lead_id: lead._id || lead.id });
                        setShowLeadDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.lead_id === (lead._id || lead.id) && "bg-primary/10 text-primary"
                    )}
                  >
                    <p className="font-medium">{lead.customerName}</p>
                    <p className="text-xs text-muted-foreground">{lead.mobile}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Selection */}
        <div className="crm-card">
            <label className="text-sm font-semibold text-foreground mb-3 block">Select Project</label>
            <div className="relative">
            <button
                type="button"
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
                {selectedProject?.projectName || <span className="text-muted-foreground">Select a project</span>}
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showProjectDropdown && "rotate-180")} />
            </button>
            {showProjectDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                {projects?.map((project) => (
                    <button
                    key={project._id || project.id}
                    type="button"
                    onClick={() => {
                        setFormData({ ...formData, project_id: project._id || project.id });
                        setShowProjectDropdown(false);
                    }}
                    className={cn(
                        "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                        formData.project_id === (project._id || project.id) && "bg-primary/10 text-primary"
                    )}
                    >
                    <p className="font-medium">{project.projectName}</p>
                    </button>
                ))}
                </div>
            )}
            </div>
        </div>

        {/* Basic Details */}
        <div className="crm-card space-y-4">
             <div className="flex gap-4">
                 <div className="flex-1">
                     <label className="text-xs font-semibold mb-1 block">Plot No *</label>
                     <input type="text" className="w-full h-10 px-3 rounded-lg bg-muted text-sm" value={formData.plot_no} onChange={e => setFormData({...formData, plot_no: e.target.value})} />
                 </div>
                 <div className="flex-1">
                     <label className="text-xs font-semibold mb-1 block">Area (sq.ft)</label>
                     <input type="number" className="w-full h-10 px-3 rounded-lg bg-muted text-sm" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                 </div>
                 <div className="flex-1">
                     <label className="text-xs font-semibold mb-1 block">Rate / sq.ft</label>
                     <input type="number" className="w-full h-10 px-3 rounded-lg bg-muted text-sm" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} />
                 </div>
             </div>
             
             <div className="flex justify-between font-bold text-sm">
                 <span>Basic Cost:</span>
                 <span>{formatCurrency(calculations.basicCost)}</span>
             </div>
        </div>
        
        {/* Additional Costs */}
        <div className="crm-card space-y-4">
            <h3 className="text-sm font-semibold">Additional Costs</h3>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-xs text-muted-foreground mb-1 block">Registry Amount</label>
                     <input type="number" className="w-full h-10 px-3 rounded-lg bg-muted text-sm" value={formData.registryAmount} onChange={e => setFormData({...formData, registryAmount: e.target.value})} />
                 </div>
                 <div>
                     <label className="text-xs text-muted-foreground mb-1 block">Stamp Duty</label>
                     <input type="number" className="w-full h-10 px-3 rounded-lg bg-muted text-sm" value={formData.stampDuty} onChange={e => setFormData({...formData, stampDuty: e.target.value})} />
                 </div>
                 <div>
                     <label className="text-xs text-muted-foreground mb-1 block">Legal / Misc</label>
                     <input type="number" className="w-full h-10 px-3 rounded-lg bg-muted text-sm" value={formData.miscellaneous} onChange={e => setFormData({...formData, miscellaneous: e.target.value})} />
                 </div>
            </div>
        </div>
        
        {/* Payment Logic */}
         <div className="crm-card space-y-4 bg-primary/5">
             <div>
                 <label className="text-xs font-semibold mb-1 block">Down Payment</label>
                 <input type="number" className="w-full h-10 px-3 rounded-lg bg-white border border-border text-sm" value={formData.downPayment} onChange={e => setFormData({...formData, downPayment: e.target.value})} />
             </div>
             
             <div className="flex justify-between text-sm py-1">
                 <span className="text-muted-foreground">Balance Amount:</span>
                 <span className="font-semibold">{formatCurrency(calculations.balanceAmount)}</span>
             </div>
             
             <div className="flex justify-between text-lg font-bold border-t border-primary/20 pt-2">
                 <span>Final Total:</span>
                 <span className="text-primary">{formatCurrency(calculations.finalPrice)}</span>
             </div>
        </div>

        {/* Actions */}
        <div className="pt-4 pb-8 space-y-3">
          <button
            type="submit"
            disabled={createQuotation.isPending}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {createQuotation.isPending ? "Generating..." : "Generate & Save Quotation"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
