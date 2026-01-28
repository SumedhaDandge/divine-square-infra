import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, Loader2, CheckCircle, XCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

export default function ImportLeads() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [uploadResults, setUploadResults] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if(!selectedFile) return;
        setFile(selectedFile);
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            setPreviewData(data.slice(0, 5)); // Preview first 5
        };
        reader.readAsBinaryString(selectedFile);
    };

    const handleUpload = async () => {
        if(!file) return;
        setIsLoading(true);
        
        try {
             // Parse full file again to ensure we have all data
            const reader = new FileReader();
            reader.onload = async (evt) => {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                
                // Expected columns: Customer Name, Mobile, Email, Project Name (optional), Interest...
                // Our backend expects: customerName, mobile, email, etc.
                // We need to map or expect standard headers.
                const jsonData = XLSX.utils.sheet_to_json(ws);
                
                // Basic mapping if headers don't match exactly?
                // For now, assume headers match our Schema or we map them.
                // Let's do a simple map assuming common headers
                const mappedData = jsonData.map((row: any) => ({
                    customerName: row["Customer Name"] || row["Name"] || row["customerName"],
                    mobile: String(row["Mobile"] || row["Phone"] || row["mobile"]),
                    email: row["Email"] || row["email"],
                    leadSource: row["Source"] || row["leadSource"], // Will be resolved by backend or default
                    lookingLocation: row["Location"] || row["lookingLocation"],
                    budget: { 
                        min: row["Min Budget"], 
                        max: row["Max Budget"] 
                    },
                    lookingFor: "Residential", // Default
                    propertyType: "Plot", // Default
                    purpose: "Investment", // Default
                }));

                const res = await divineSquareService.bulkCreateLeads(mappedData);
                if(res.status === 200) {
                    setUploadResults(res.data);
                    toast.success(`Processed! Success: ${res.data.success}, Failed: ${res.data.failed}`);
                }
                setIsLoading(false);
            };
            reader.readAsBinaryString(file);
            
        } catch(error) {
            console.error(error);
            toast.error("Failed to upload leads");
            setIsLoading(false);
        }
    };

    return (
        <AppShell>
             <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
                <h1 className="text-xl font-bold">Import Leads</h1>
                <p className="text-sm text-muted-foreground">Upload Excel (.xlsx) or CSV file</p>
             </header>

             <main className="p-4 space-y-6">
                 {!uploadResults ? (
                     <>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center bg-muted/30">
                            <FileSpreadsheet className="w-12 h-12 mx-auto text-primary mb-3"/>
                            <p className="font-medium mb-2">Drag and drop or click to upload</p>
                            <input 
                                type="file" 
                                accept=".xlsx, .xls, .csv" 
                                onChange={handleFileChange}
                                className="hidden" 
                                id="file-upload"
                            />
                            <label 
                                htmlFor="file-upload" 
                                className="inline-block px-4 py-2 bg-white text-foreground border border-border rounded-lg shadow-sm cursor-pointer hover:bg-muted transition-colors"
                            >
                                Select File
                            </label>
                            {file && <p className="mt-4 text-sm font-semibold text-primary">{file.name}</p>}
                        </div>

                        {previewData.length > 0 && (
                            <div className="overflow-x-auto rounded-lg border border-border">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted">
                                        <tr>
                                            {Object.keys(previewData[0]).map(key => (
                                                <th key={key} className="p-2 text-left font-medium">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, i) => (
                                            <tr key={i} className="border-t border-border">
                                                {Object.values(row).map((val: any, j) => (
                                                    <td key={j} className="p-2">{String(val)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button 
                            onClick={handleUpload}
                            disabled={!file || isLoading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin"/> : <Upload className="w-5 h-5"/>}
                            {isLoading ? "Uploading..." : "Start Import"}
                        </button>
                     </>
                 ) : (
                     <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                 <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2"/>
                                 <p className="text-2xl font-bold text-green-700">{uploadResults.success}</p>
                                 <p className="text-xs text-green-600 font-medium">Successful</p>
                             </div>
                             <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                 <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2"/>
                                 <p className="text-2xl font-bold text-red-700">{uploadResults.failed}</p>
                                 <p className="text-xs text-red-600 font-medium">Failed</p>
                             </div>
                         </div>
                         
                         {uploadResults.errors.length > 0 && (
                             <div className="bg-card border border-border rounded-xl overflow-hidden">
                                 <div className="bg-muted px-4 py-2 text-sm font-semibold">Error Log</div>
                                 <div className="max-h-60 overflow-y-auto p-4 space-y-2">
                                     {uploadResults.errors.map((err: any, i:number) => (
                                         <div key={i} className="text-xs text-red-500 pb-2 border-b border-border/50 last:border-0">
                                             <span className="font-bold">Row {err.row}:</span> {err.error} ({err.mobile})
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}

                         <button 
                            onClick={() => navigate("/leads")} 
                            className="w-full py-3 bg-muted text-foreground rounded-xl font-bold"
                         >
                             Go to Leads
                         </button>
                         <button 
                            onClick={() => { setUploadResults(null); setFile(null); setPreviewData([]); }}
                            className="w-full py-3 text-sm text-muted-foreground"
                         >
                             Upload Another File
                         </button>
                     </div>
                 )}
             </main>
        </AppShell>
    );
}
