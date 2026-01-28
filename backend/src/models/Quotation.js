
import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    
    // Auto-fetched but good to snapshot
    customerName: String,
    projectName: String,
    
    plotNo: String,
    area: Number,
    rate: Number,
    
    // Calculations
    basicCost: Number, // Area * Rate
    
    downPayment: { type: Number, default: 0 },
    balanceAmount: Number, // basicCost - downPayment
    
    // Gov & Extras
    registryAmount: { type: Number, default: 0 },
    stampDuty: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 },
    
    // Final
    finalTotalAmount: Number,
    
    // File
    pdfPath: String, // Local path or URL
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Quotation", quotationSchema);
