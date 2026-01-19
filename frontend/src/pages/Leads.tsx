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


// const statusToDisplay: Record<any, string> = {
//   new: "new",
//   contacted: "warm",
//   qualified: "warm",
//   negotiation: "hot",
//   won: "converted",
//   lost: "cold",
// };

// const filters: { label: string; value: any | "all" }[] = [
//   { label: "All", value: "all" },
//   { label: "New", value: "new" },
//   { label: "Contacted", value: "contacted" },
//   { label: "Qualified", value: "qualified" },
//   { label: "Negotiation", value: "negotiation" },
//   { label: "Won", value: "won" },
//   { label: "Lost", value: "lost" },
// ];

// export default function Leads() {
//   const navigate = useNavigate();
//   const { lead , leadSources} = useDataContext();
//   const { fetchLeads, isLoading } = useLeads();
//   const {fetchLeadSources} = useMaster();
//   const [activeFilter, setActiveFilter] = useState<any>("all");
//   const [searchQuery, setSearchQuery] = useState("");


//   useEffect(() => {
//     fetchLeads();
//     fetchLeadSources();
//   }, []);

//   console.log("Lead Sources:", leadSources);
//   console.log("Leads Data:", lead);

//   const filteredLeads = lead?.filter((lead) => {
//     const matchesFilter = activeFilter === "all" || lead.status === activeFilter;
//     const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       lead.phone.includes(searchQuery) ||
//       lead.projects?.name?.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const formatBudget = (min: number | null, max: number | null) => {
//     if (!min && !max) return null;
//     const formatVal = (val: number) => {
//       if (val >= 100) return `${(val / 100).toFixed(1)}Cr`;
//       return `${val}L`;
//     };
//     if (min && max) return `${formatVal(min)} - ${formatVal(max)}`;
//     if (min) return `From ${formatVal(min)}`;
//     if (max) return `Up to ${formatVal(max)}`;
//     return null;
//   };

 

//   return (
//     <AppShell fabAction={() => navigate("/leads/new")}>
//       {/* Header */}
//       <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-xl font-bold text-foreground">Leads</h1>
//           <button className="touch-btn w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
//             <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
//           </button>
//         </div>

//         {/* Search */}
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Search leads, projects..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
//           />
//         </div>

//         {/* Filter Pills */}
//         <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
//           {filters.map((filter) => (
//             <button
//               key={filter.value}
//               onClick={() => setActiveFilter(filter.value)}
//               className={cn(
//                 "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
//                 activeFilter === filter.value
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-muted text-muted-foreground hover:bg-muted/80"
//               )}
//             >
//               {filter.label}
//             </button>
//           ))}
//         </div>
//       </header>

//       {/* Leads List */}
//       <main className="flex-1 px-4 py-4 space-y-3">
//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//           </div>
//         ) : filteredLeads?.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <Users className="w-12 h-12 text-muted-foreground mb-4" />
//             <h3 className="text-lg font-semibold text-foreground mb-1">No Leads Found</h3>
//             <p className="text-sm text-muted-foreground">
//               {searchQuery || activeFilter !== "all" 
//                 ? "Try adjusting your filters" 
//                 : "Add your first lead to get started"}
//             </p>
//             {!searchQuery && activeFilter === "all" && (
//               <button
//                 onClick={() => navigate("/leads/new")}
//                 className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
//               >
//                 Add Lead
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-sm text-muted-foreground">
//                 {filteredLeads?.length} leads found
//               </p>
//               <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
//                 Recent <ChevronDown className="w-4 h-4" />
//               </button>
//             </div>

//             {filteredLeads?.map((lead) => (
//               <LeadCard
//                 key={lead.id}
//                 id={lead.id}
//                 name={lead.name}
//                 phone={lead.phone}
//                 // status={getLeadDisplayStatus(lead.status)}
//                 source={lead.source.replace("_", " ")}
//                 project={lead.projects?.name}
//                 budget={formatBudget(lead.budget_min, lead.budget_max) || undefined}
//                 onClick={() => navigate(`/leads/${lead.id}`)}
//                 onCall={() => window.open(`tel:${lead.phone}`)}
//                 onWhatsApp={() => window.open(`https://wa.me/${lead.phone.replace(/\s/g, "")}`)}
//               />
//             ))}
//           </>
//         )}
//       </main>
//     </AppShell>
//   );
// }





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
              onClick={() => navigate(`/leads/${item._id}`)}
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
