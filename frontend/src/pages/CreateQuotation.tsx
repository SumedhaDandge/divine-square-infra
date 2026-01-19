import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2, ChevronDown, Calculator, FileText, Calendar as CalendarIcon, Share2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateQuotation } from "@/hooks/useQuotations";
import { useLeads } from "@/hooks/useLeads";
import { useProjects, useProjectPlots } from "@/hooks/useProjects";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreateQuotation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get("leadId");
  
  const createQuotation = useCreateQuotation();
  const { data: leads } = useLeads();
  const { data: projects } = useProjects();
  
  const [formData, setFormData] = useState({
    lead_id: leadIdParam || "",
    project_id: "",
    plot_id: "",
    discount_percentage: 0,
    valid_until: addDays(new Date(), 7),
    terms: "",
  });
  
  const { data: plots } = useProjectPlots(formData.project_id);
  
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showPlotDropdown, setShowPlotDropdown] = useState(false);

  const selectedLead = leads?.find((l) => l.id === formData.lead_id);
  const selectedProject = projects?.find((p) => p.id === formData.project_id);
  const selectedPlot = plots?.find((p) => p.id === formData.plot_id);

  const calculations = useMemo(() => {
    if (!selectedPlot) {
      return { basePrice: 0, discountAmount: 0, finalPrice: 0 };
    }
    
    const basePrice = Number(selectedPlot.total_price);
    const discountAmount = (basePrice * formData.discount_percentage) / 100;
    const finalPrice = basePrice - discountAmount;
    
    return { basePrice, discountAmount, finalPrice };
  }, [selectedPlot, formData.discount_percentage]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lead_id || !formData.plot_id) {
      toast.error("Please select a lead and a plot");
      return;
    }

    try {
      await createQuotation.mutateAsync({
        lead_id: formData.lead_id,
        plot_id: formData.plot_id,
        base_price: calculations.basePrice,
        discount_percentage: formData.discount_percentage,
        discount_amount: calculations.discountAmount,
        final_price: calculations.finalPrice,
        valid_until: format(formData.valid_until, "yyyy-MM-dd"),
        terms: formData.terms || undefined,
      });
      
      navigate(-1);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleShare = () => {
    if (!selectedPlot || !selectedLead) {
      toast.error("Please select a lead and plot first");
      return;
    }

    const message = `
*Divine Square Infra - Quotation*
━━━━━━━━━━━━━━━━━━━━

*Client:* ${selectedLead.name}
*Project:* ${selectedProject?.name}
*Plot No:* ${selectedPlot.plot_number}
*Area:* ${selectedPlot.area_sqft} sq.ft
*Facing:* ${selectedPlot.facing || "N/A"}

━━━━━━━━━━━━━━━━━━━━
*Price Breakdown*
━━━━━━━━━━━━━━━━━━━━

Base Price: ${formatCurrency(calculations.basePrice)}
Discount (${formData.discount_percentage}%): -${formatCurrency(calculations.discountAmount)}

*Final Price: ${formatCurrency(calculations.finalPrice)}*

Valid Until: ${format(formData.valid_until, "PPP")}

━━━━━━━━━━━━━━━━━━━━
_Thank you for choosing Divine Square Infra!_
    `.trim();

    const whatsappUrl = `https://wa.me/${selectedLead.phone.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <AppShell showFab={false} showBottomNav={false}>
      {/* Header */}
      <header className="bg-status-cold text-white px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Create Quotation</h1>
            <p className="text-sm opacity-70">Generate a price quote for your lead</p>
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
              {selectedLead ? (
                <span>{selectedLead.name} - {selectedLead.phone}</span>
              ) : (
                <span className="text-muted-foreground">Select a lead</span>
              )}
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showLeadDropdown && "rotate-180")} />
            </button>
            {showLeadDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                {leads?.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, lead_id: lead.id });
                      setShowLeadDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.lead_id === lead.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Selection */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">Select Project *</label>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {selectedProject?.name || <span className="text-muted-foreground">Select a project</span>}
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showProjectDropdown && "rotate-180")} />
            </button>
            {showProjectDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                {projects?.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, project_id: project.id, plot_id: "" });
                      setShowProjectDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.project_id === project.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.location}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Plot Selection */}
        {formData.project_id && (
          <div className="crm-card">
            <label className="text-sm font-semibold text-foreground mb-3 block">Select Plot *</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPlotDropdown(!showPlotDropdown)}
                className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
              >
                {selectedPlot ? (
                  <span>Plot {selectedPlot.plot_number} - {selectedPlot.area_sqft} sq.ft</span>
                ) : (
                  <span className="text-muted-foreground">Select a plot</span>
                )}
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showPlotDropdown && "rotate-180")} />
              </button>
              {showPlotDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                  {plots?.filter(p => p.status === "available").map((plot) => (
                    <button
                      key={plot.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, plot_id: plot.id });
                        setShowPlotDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                        formData.plot_id === plot.id && "bg-primary/10 text-primary"
                      )}
                    >
                      <p className="font-medium">Plot {plot.plot_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {plot.area_sqft} sq.ft • {plot.facing || "N/A"} facing • {formatCurrency(Number(plot.total_price))}
                      </p>
                    </button>
                  ))}
                  {(!plots || plots.filter(p => p.status === "available").length === 0) && (
                    <p className="px-4 py-3 text-sm text-muted-foreground">No available plots</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price Calculator */}
        {selectedPlot && (
          <div className="crm-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-accent" />
              </div>
              <label className="text-sm font-semibold text-foreground">Price Calculation</label>
            </div>

            {/* Base Price */}
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Base Price</span>
              <span className="text-sm font-medium">{formatCurrency(calculations.basePrice)}</span>
            </div>

            {/* Discount Slider */}
            <div className="py-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Discount</span>
                <span className="text-sm font-medium text-status-hot">-{formData.discount_percentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Discount Amount */}
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Discount Amount</span>
              <span className="text-sm font-medium text-status-hot">-{formatCurrency(calculations.discountAmount)}</span>
            </div>

            {/* Final Price */}
            <div className="flex justify-between py-3 mt-2 bg-primary/5 -mx-4 px-4 rounded-xl">
              <span className="font-semibold text-foreground">Final Price</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(calculations.finalPrice)}</span>
            </div>
          </div>
        )}

        {/* Valid Until */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">Valid Until</label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-12 px-4 rounded-xl bg-muted text-left flex items-center gap-2"
              >
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                {format(formData.valid_until, "PPP")}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.valid_until}
                onSelect={(date) => date && setFormData({ ...formData, valid_until: date })}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Terms */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">Terms & Conditions</label>
          </div>
          <textarea
            placeholder="Add any special terms or conditions..."
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 pb-8 space-y-3">
          <button
            type="submit"
            disabled={createQuotation.isPending || !formData.lead_id || !formData.plot_id}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {createQuotation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Save Quotation"
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={!formData.lead_id || !formData.plot_id}
            className="w-full h-14 rounded-xl bg-status-hot text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share via WhatsApp
          </button>
        </div>
      </form>
    </AppShell>
  );
}
