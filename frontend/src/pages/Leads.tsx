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
import { Search, Plus, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";




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
      <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <div className="flex justify-between items-center mb-6">
             <h1 className="text-xl font-bold">Leads <span className="text-muted-foreground text-sm font-normal">({filteredLeads?.length})</span></h1>
             <div className="flex gap-2">
                <button 
                  onClick={() => navigate("/leads/import")}
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                  title="Import Excel"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate("/leads/new")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Lead
                </button>
             </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on search
            }}
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      {/* Leads List */}
      <main className="flex-1 px-4 py-4 space-y-3 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginatedLeads?.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No leads found
          </p>
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
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-border/50 gap-4">
                    <p className="text-sm text-muted-foreground order-2 sm:order-1">
                        Page <span className="font-semibold text-foreground">{currentPage}</span> of {totalPages}
                    </p>
                    
                    <div className="flex gap-2 order-1 sm:order-2">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronLeft className="w-5 h-5"/>
                        </button>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronRight className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}

