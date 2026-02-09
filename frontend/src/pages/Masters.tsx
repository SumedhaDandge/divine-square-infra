import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { divineSquareApi } from "@/services/API/DivineInfraApi/DivineInfraApi";
import { Plus, Edit2, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MasterType = "amenity" | "nearby" | "source";

interface MasterItem {
  _id: string;
  name: string;
  icon?: string; // For amenity/nearby if needed
}

export default function Masters() {
  const [activeTab, setActiveTab] = useState<MasterType>("amenity");
  const [items, setItems] = useState<MasterItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      let res;
      if (activeTab === "amenity") {
        res = await divineSquareApi.listAmmeneities();
      } else if (activeTab === "nearby") {
        res = await divineSquareApi.listNearByDevelopments();
      } else {
        res = await divineSquareApi.listLeadSources();
      }
      setItems(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Update
        if (activeTab === "amenity") {
          await divineSquareApi.updateAmenity(editingItem._id, formData);
        } else if (activeTab === "nearby") {
          await divineSquareApi.updateNearbyDevelopment(editingItem._id, formData);
        } else {
          await divineSquareApi.updateLeadSource(editingItem._id, formData);
        }
        toast.success("Updated successfully");
      } else {
        // Create
        if (activeTab === "amenity") {
          await divineSquareApi.createAmenity(formData);
        } else if (activeTab === "nearby") {
          await divineSquareApi.createNearbyDevelopment(formData);
        } else {
          await divineSquareApi.createLeadSource(formData);
        }
        toast.success("Created successfully");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (item?: MasterItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name });
    } else {
      setEditingItem(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell showFab={false}>
      <div className="p-4 space-y-4 pb-20">
        <header>
          <h1 className="text-2xl font-bold">Masters Management</h1>
          <p className="text-muted-foreground text-sm">Manage system wide configurations</p>
        </header>

        {/* Tabs */}
        <div className="flex p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab("amenity")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === "amenity" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Amenities
          </button>
          <button
            onClick={() => setActiveTab("nearby")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === "nearby" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Nearby Devs
          </button>
          <button
            onClick={() => setActiveTab("source")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === "source" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lead Sources
          </button>
        </div>

        {/* Search & Add */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => openModal(item)}
                className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <span className="font-medium group-hover:text-primary transition-colors">{item.name}</span>
                <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))
          ) : (
             <div className="text-center py-8 text-muted-foreground text-sm">
               No items found
             </div>
          )}
        </div>
      </div>

      {/* Modal / Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? "Edit" : "Add New"} {activeTab === "amenity" ? "Amenity" : activeTab === "nearby" ? "Nearby Development" : "Lead Source"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                <input
                  autoFocus
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter name..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-medium rounded-xl border hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim()}
                  className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
