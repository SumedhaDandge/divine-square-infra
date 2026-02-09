
import { AppShell } from "@/components/layout/AppShell";
import { useAllQuotations } from "@/hooks/useQuotations";
import { FileText, Search, Download } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function Quotations() {
  const { data: quotations, isLoading } = useAllQuotations();
  const [search, setSearch] = useState("");

  const filteredQuotations = quotations?.filter(q => 
    q.customerName.toLowerCase().includes(search.toLowerCase()) ||
    q.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-30 flex items-center justify-between">
         <h1 className="text-xl font-bold">All Quotations</h1>
      </header>
      
      <main className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5"/>
            <input 
                type="text" 
                placeholder="Search by customer or project..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            />
        </div>

        {isLoading ? (
            <div className="text-center py-10 opacity-50">Loading quotations...</div>
        ) : filteredQuotations?.length === 0 ? (
            <div className="text-center py-10 opacity-50">No quotations found.</div>
        ) : (
            <div className="grid gap-4">
                {filteredQuotations?.map((quote) => (
                    <div key={quote._id} className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">{quote.customerName}</h3>
                                <p className="text-xs text-muted-foreground">{quote.projectName} • Plot {quote.plotNo}</p>
                                <p className="text-xs font-semibold mt-1">₹ {quote.finalTotalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{format(new Date(quote.createdAt), "dd MMM yyyy")}</span>
                            {quote.pdfPath && (
                                <a 
                                    href={`http://localhost:5000${quote.pdfPath}`} // Assuming local dev, production should use full URL or relative
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-2 bg-muted hover:bg-primary hover:text-white rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4"/>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </AppShell>
  );
}
