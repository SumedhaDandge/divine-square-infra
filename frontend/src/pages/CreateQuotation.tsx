import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, Building2, ChevronDown, Calculator, FileText, 
  Calendar as CalendarIcon, Wallet, Percent, MapPin, 
  FileCheck, Banknote, Landmark, Check
} from "lucide-react";
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

  const [areaSqMeter, setAreaSqMeter] = useState("");

  const handleSqMeterChange = (val: string) => {
      setAreaSqMeter(val);
      const sqMt = parseFloat(val);
      if (!isNaN(sqMt)) {
          setFormData(prev => ({ ...prev, area: (sqMt * 10.7639).toFixed(2) }));
      } else {
          setFormData(prev => ({ ...prev, area: "" }));
      }
  };

  const handleSqFtChange = (val: string) => {
      setFormData(prev => ({ ...prev, area: val }));
      const sqFt = parseFloat(val);
      if (!isNaN(sqFt)) {
          setAreaSqMeter((sqFt / 10.7639).toFixed(2));
      } else {
          setAreaSqMeter("");
      }
  };

  const calculations = useMemo(() => {
    const area = parseFloat(formData.area) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const basicCost = area * rate;
    
    // ... rest same
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
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
          <div className="px-4 h-16 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div>
                <h1 className="text-lg font-bold text-slate-800">New Quotation</h1>
                <p className="text-xs text-slate-500 font-medium">Create a new price estimate</p>
            </div>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-2xl mx-auto pb-32">
            
            {/* Customer & Project Section */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Project Details</h2>
                </div>

                {/* Lead Selection */}
                <div className="relative">
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block ml-1">Client Name <span className="text-red-500">*</span></label>
                    <button
                    type="button"
                    onClick={() => setShowLeadDropdown(!showLeadDropdown)}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-slate-800 flex items-center justify-between hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {selectedLead ? selectedLead.customerName.charAt(0) : "?"}
                        </div>
                        <span className="truncate">{selectedLead ? selectedLead.customerName : <span className="text-slate-400 font-normal">Select a client...</span>}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showLeadDropdown && "rotate-180")} />
                    </button>
                    {showLeadDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                        {leads?.map((lead) => (
                        <button
                            key={lead._id || lead.id}
                            type="button"
                            onClick={() => {
                                setFormData({ ...formData, lead_id: lead._id || lead.id });
                                setShowLeadDropdown(false);
                            }}
                            className={cn(
                            "w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group",
                            formData.lead_id === (lead._id || lead.id) && "bg-primary/5"
                            )}
                        >
                            <div>
                                <p className={cn("text-sm font-semibold", formData.lead_id === (lead._id || lead.id) ? "text-primary" : "text-slate-700")}>{lead.customerName}</p>
                                <p className="text-xs text-slate-400">{lead.mobile}</p>
                            </div>
                            {formData.lead_id === (lead._id || lead.id) && <Check className="w-4 h-4 text-primary" />}
                        </button>
                        ))}
                    </div>
                    )}
                </div>

                {/* Project Selection */}
                <div className="relative">
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block ml-1">Project Name</label>
                    <button
                        type="button"
                        onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-slate-800 flex items-center justify-between hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">{selectedProject?.projectName || <span className="text-slate-400 font-normal">Select a project...</span>}</span>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showProjectDropdown && "rotate-180")} />
                    </button>
                    {showProjectDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                        {projects?.map((project) => (
                            <button
                            key={project._id || project.id}
                            type="button"
                            onClick={() => {
                                setFormData({ ...formData, project_id: project._id || project.id });
                                setShowProjectDropdown(false);
                            }}
                            className={cn(
                                "w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between",
                                formData.project_id === (project._id || project.id) && "bg-primary/5"
                            )}
                            >
                            <span className={cn("text-sm font-medium", formData.project_id === (project._id || project.id) ? "text-primary" : "text-slate-700")}>{project.projectName}</span>
                            {formData.project_id === (project._id || project.id) && <Check className="w-4 h-4 text-primary" />}
                            </button>
                        ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Unit Details */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Unit & Pricing</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                         <label className="text-xs font-semibold text-slate-500 ml-1">Plot No <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none" 
                            placeholder="e.g. 12B"
                            value={formData.plot_no} 
                            onChange={e => setFormData({...formData, plot_no: e.target.value})} 
                         />
                     </div>
                     <div className="space-y-1.5">
                         <label className="text-xs font-semibold text-slate-500 ml-1">Rate (₹/sq.ft)</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                            <input 
                                type="number" 
                                className="w-full h-11 pl-7 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none" 
                                placeholder="0"
                                value={formData.rate} 
                                onChange={e => setFormData({...formData, rate: e.target.value})} 
                            />
                         </div>
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="relative p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Area (Sq.Mtr)</label>
                         <div className="flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-slate-300" />
                            <input 
                                type="number" 
                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300" 
                                placeholder="0.00"
                                value={areaSqMeter} 
                                onChange={e => handleSqMeterChange(e.target.value)} 
                            />
                         </div>
                     </div>
                     <div className="relative p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Area (Sq.Ft)</label>
                         <div className="flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-slate-300" />
                            <input 
                                type="number" 
                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300" 
                                placeholder="0.00"
                                value={formData.area} 
                                onChange={e => handleSqFtChange(e.target.value)} 
                            />
                         </div>
                     </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-xs font-bold text-primary/70 uppercase">Basic Cost</span>
                    <span className="text-base font-bold text-primary">{formatCurrency(calculations.basicCost)}</span>
                </div>
            </section>

            {/* Additional Costs */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Government & Legal</h2>
                </div>

                <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Registry</label>
                            <input type="number" className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm" placeholder="0" value={formData.registryAmount} onChange={e => setFormData({...formData, registryAmount: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 ml-1">Stamp Duty</label>
                            <input type="number" className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm" placeholder="0" value={formData.stampDuty} onChange={e => setFormData({...formData, stampDuty: e.target.value})} />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Legal / Misc Fees</label>
                        <input type="number" className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm" placeholder="0" value={formData.miscellaneous} onChange={e => setFormData({...formData, miscellaneous: e.target.value})} />
                    </div>
                </div>
            </section>
            
            {/* Payment Breakdown */}
            <section className="bg-slate-900 rounded-2xl p-5 shadow-lg space-y-5 text-white">
                 <div className="flex items-center gap-2 mb-2 opacity-90">
                    <Banknote className="w-4 h-4 text-yellow-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wide">Final Calculations</h2>
                </div>

                <div className="space-y-4">
                     <div className="space-y-1.5">
                         <label className="text-xs font-semibold text-slate-400 ml-1">Down Payment / Booking</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₹</span>
                            <input 
                                type="number" 
                                className="w-full h-11 pl-7 pr-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all outline-none placeholder:text-white/20" 
                                placeholder="Enter amount"
                                value={formData.downPayment} 
                                onChange={e => setFormData({...formData, downPayment: e.target.value})} 
                            />
                         </div>
                     </div>

                     <div className="pt-4 border-t border-white/10 space-y-3">
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-400">Basic Cost</span>
                             <span className="font-medium">{formatCurrency(calculations.basicCost)}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-400">Total Gov. Taxes</span>
                             <span className="font-medium text-red-300">+ {formatCurrency(parseFloat(formData.registryAmount||"0") + parseFloat(formData.stampDuty||"0") + parseFloat(formData.miscellaneous||"0"))}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-400">Down Payment</span>
                             <span className="font-medium text-green-400">- {formatCurrency(parseFloat(formData.downPayment||"0"))}</span>
                         </div>
                     </div>

                     <div className="pt-4 border-t border-dashed border-white/20">
                         <div className="flex justify-between items-end mb-2">
                             <span className="text-sm font-medium text-slate-300">Net Payable Balance</span>
                             <span className="text-2xl font-bold text-white">{formatCurrency(calculations.finalPrice - (parseFloat(formData.downPayment)||0))}</span>
                         </div>
                         <div className="flex justify-between items-center bg-white/10 rounded-lg p-2 px-3">
                             <span className="text-xs text-slate-300">Total Deal Value</span>
                             <span className="text-sm font-bold text-yellow-400">{formatCurrency(calculations.finalPrice)}</span>
                         </div>
                     </div>
                </div>
            </section>

        </form>
      </div>

      {/* Fixed Footer */}
      <div className="bg-white border-t border-border p-4 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="max-w-2xl mx-auto">
            <button
                onClick={handleSubmit}
                disabled={createQuotation.isPending}
                className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {createQuotation.isPending ? "Generating PDF..." : "Generate & Save Quotation"}
            </button>
          </div>
      </div>
    </AppShell>
  );
}
