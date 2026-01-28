import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { divineSquareService } from "@/services/DivineInfraService";
import { format } from "date-fns";
import { 
  Phone, 
  MessageCircle, 
  Trash2, 
  Search, 
  MapPin, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const res = await divineSquareService.listInquiries();
      if (res.status === 200 || res.statusCode === 200) {
        setInquiries(res.data);
        setFilteredInquiries(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch inquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
      if(!searchQuery) {
          setFilteredInquiries(inquiries);
          return;
      }
      const query = searchQuery.toLowerCase();
      const filtered = inquiries.filter(i => 
          i.name.toLowerCase().includes(query) || 
          i.mobile.includes(query) ||
          i.email?.toLowerCase().includes(query)
      );
      setFilteredInquiries(filtered);
  }, [searchQuery, inquiries]);

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
        const res = await divineSquareService.deleteInquiry(id);
        if(res.status === 200) {
            toast.success("Inquiry deleted successfully");
            fetchInquiries();
        }
    } catch(error) {
        console.error(error);
        toast.error("Failed to delete inquiry");
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          const res = await divineSquareService.updateInquiry(id, { status: newStatus });
          if(res.status === 200) {
              toast.success("Status updated");
              // Optimistic update
              setInquiries(prev => prev.map(i => i._id === id ? {...i, status: newStatus} : i));
          }
      } catch(error) {
          console.error(error);
          toast.error("Failed to update status");
      }
  }

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <h1 className="text-xl font-bold mb-4">Website Inquiries</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      <div className="p-4 space-y-4">
          {isLoading ? (
             <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
          ) : filteredInquiries.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
                 <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                 <p>No inquiries found</p>
             </div>
          ) : (
              filteredInquiries.map((inquiry) => (
                  <div key={inquiry._id} className="crm-card animate-slide-up">
                      {/* Card Header: Name and Actions */}
                      <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 mr-2">
                              <h3 className="font-semibold text-lg text-foreground truncate">{inquiry.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3"/>
                                  {format(new Date(inquiry.createdAt), "MMM dd, yyyy • hh:mm a")}
                              </div>
                          </div>
                          
                          <select
                              value={inquiry.status}
                              onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                              className={cn(
                                  "text-xs font-medium px-2 py-1 rounded-full border-none outline-none cursor-pointer appearance-none",
                                  inquiry.status === "new" && "bg-blue-100 text-blue-700",
                                  inquiry.status === "contacted" && "bg-yellow-100 text-yellow-700",
                                  inquiry.status === "closed" && "bg-green-100 text-green-700"
                              )}
                          >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                          </select>
                      </div>

                      {/* Info Chips */}
                      <div className="flex flex-wrap gap-2 mb-3">
                          {inquiry.project && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/50 text-xs font-medium text-foreground">
                                <MapPin className="w-3 h-3"/>
                                {inquiry.project.projectName}
                            </div>
                          )}
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/50 text-xs font-medium text-foreground">
                             Source: {inquiry.source || "Website"}
                          </div>
                      </div>

                      {/* Message Box */}
                      {inquiry.message && (
                          <div className="bg-muted p-3 rounded-lg text-sm text-foreground/80 mb-4 italic leading-relaxed">
                              "{inquiry.message}"
                          </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-[1fr,1fr,auto] gap-2 pt-2 border-t border-border">
                          <button
                            onClick={() => window.open(`tel:${inquiry.mobile}`)}
                            className="flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                          >
                              <Phone className="w-4 h-4" />
                              Call
                          </button>
                          
                          <button
                            onClick={() => window.open(`https://wa.me/${inquiry.mobile}`)}
                            className="flex items-center justify-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                          >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                          </button>

                          <button
                             onClick={() => handleDelete(inquiry._id)}
                             className="flex items-center justify-center px-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                          >
                              <Trash2 className="w-4 h-4"/>
                          </button>
                      </div>
                  </div>
              ))
          )}
      </div>
    </AppShell>
  );
}
