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

    const handleViewClick = (dataObj: any) => {
        navigate(`/leads/view`, {
            state: {
                dataObj,
            }
        });
    };

  return (
    <AppShell fabAction={() => navigate("/leads/new")}>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <h1 className="text-xl font-bold">Leads</h1>

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-muted"
          />
        </div>
      </header>

      {/* Leads List */}
      <main className="flex-1 px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLeads?.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No leads found
          </p>
        ) : (
          filteredLeads?.map((item: any) => (
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
              onClick={() => handleViewClick(item.dataObj)}
              onCall={() => window.open(`tel:${item.mobile}`)}
              onWhatsApp={() =>
                window.open(`https://wa.me/${item.mobile}`)
              }
            />
          ))
        )}
      </main>
    </AppShell>
  );
}
