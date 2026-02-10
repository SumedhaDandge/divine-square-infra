// import { useEffect, useState } from "react";
// import { AppShell } from "@/components/layout/AppShell";
// import { LeadCard } from "@/components/leads/LeadCard";
// import { Search, SlidersHorizontal, ChevronDown, Users } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { cn } from "@/lib/utils";
// import useLeads from "@/hooks/useLeads";
// import { useDataContext } from "@/contex/DataContext";
// import { useMaster } from "@/hooks/useMaster";

import { AppShell } from "@/components/layout/AppShell";
import { LeadCard } from "@/components/leads/LeadCard";
import { useDataContext } from "@/contex/DataContext";
import useLeads from "@/hooks/useLeads";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, FileSpreadsheet, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";




export default function Leads() {
  const navigate = useNavigate();
  const { leads } = useDataContext();
  const { fetchLeads, isLoading } = useLeads();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");



  useEffect(() => {
    fetchLeads();
  }, []);

    console.log("Leads Data:", leads);

  const filteredLeads = leads?.filter((item: any) => {
    const name = item.customerName?.toLowerCase() || "";
    const phone = item.mobile || "";
    const project =
      item.interestedProject?.projectName?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      phone.includes(search) ||
      project.includes(search);

    const matchesFilter =
      activeFilter === "all" || item.leadStatus === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const formatBudget = (
    min?: number,
    max?: number
  ): string | undefined => {
    if (!min && !max) return undefined;

    const formatVal = (val: number) => {
      if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
      return `${val}`;
    };

    if (min && max) return `${formatVal(min)} - ${formatVal(max)}`;
    if (min) return `From ${formatVal(min)}`;
    if (max) return `Up to ${formatVal(max)}`;
  };

  /* ------------------ PAGINATION ------------------ */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil((filteredLeads?.length || 0) / itemsPerPage);
  
  const paginatedLeads = filteredLeads?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  return (
    <AppShell showFab={false}>
      {/* Header */}
      <header className="px-5 pt-8 pb-2 sticky top-0 z-30 bg-background shadow-sm">
        <div className="flex justify-between items-center mb-6">
             <h1 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-6 h-6" />
                </div>
                Leads
             </h1>
             <div className="flex gap-3">
                <button 
                  onClick={() => navigate("/leads/import")}
                  className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  title="Import Excel"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate("/leads/new")}
                  className="w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-6 h-6" />
                </button>
             </div>
        </div>

        <div className="relative mb-6 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on search
            }}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 pb-2 px-1">
            {["all", "new", "converted", "booked", "lost"].map((status) => (
                <button
                    key={status}
                    onClick={() => { setActiveFilter(status); setCurrentPage(1); }}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize border",
                        activeFilter === status
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background text-foreground border-border hover:bg-muted"
                    )}
                >
                    {status}
                </button>
            ))}
        </div>
      </header>

      {/* Leads List */}
      <main className="flex-1 px-4 py-4 space-y-3 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginatedLeads?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No leads found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
              {searchQuery ? "Try adjusting your search query" : `No ${activeFilter !== 'all' ? activeFilter : ''} leads available`}
            </p>
          </div>
        ) : (
          <>
            {paginatedLeads?.map((item: any) => (
                <LeadCard
                key={item._id}
                id={item._id}
                name={item.customerName}
                phone={item.mobile}
                status={item.leadStatus}
                source={item.leadSource?.name || "Unknown"}
                project={item.interestedProject?.projectName}
                budget={formatBudget(
                    item.budget?.min,
                    item.budget?.max
                )}
                // onClick={() => navigate(`/leads/view`)}
                onClick={() => navigate(`/leads/${item._id}`)}
                onCall={() => window.open(`tel:${item.mobile}`)}
                onWhatsApp={() =>
                    window.open(`https://wa.me/${item.mobile}`)
                }
                />
            ))}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-4">
                     <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border shadow-sm text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5"/>
                    </button>
                    
                    <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {currentPage} / {totalPages}
                    </span>

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border shadow-sm text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5"/>
                    </button>
                </div>
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}

