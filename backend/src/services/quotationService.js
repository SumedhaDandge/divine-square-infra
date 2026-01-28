
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Quotation from "../models/Quotation.js";
import { Lead } from "../models/Lead.js";
import Project from "../models/Project.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createQuotationService = async (payload, userId) => {
  // 1. Fetch Lead & Project for details
  const lead = await Lead.findById(payload.lead);
  if (!lead) throw new Error("Lead not found");
  
  // Optional Project Name override or fetch
  let projectName = payload.projectName;
  if (!projectName && lead.interestedProject) {
      const proj = await Project.findById(lead.interestedProject);
      if(proj) projectName = proj.projectName;
  }
  
  // 2. Calculate Totals
  const rate = parseFloat(payload.rate) || 0;
  const area = parseFloat(payload.area) || 0;
  const basicCost = rate * area;
  
  const downPayment = parseFloat(payload.downPayment) || 0;
  const balanceAmount = basicCost - downPayment;
  
  const registry = parseFloat(payload.registryAmount) || 0;
  const stamp = parseFloat(payload.stampDuty) || 0;
  const misc = parseFloat(payload.miscellaneous) || 0;
  
  const finalTotalAmount = basicCost + registry + stamp + misc;

  // 3. Generate PDF
  const filename = `quotation_${lead._id}_${Date.now()}.pdf`;
  const uploadDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, filename);
  
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // --- PDF DESIGN ---
  // Header
  // doc.image('path/to/logo.png', 50, 45, { width: 50 }) // If we had a logo
  doc.fontSize(20).text("MAULI GROUP", { align: "center" });
  doc.fontSize(10).text("THE BOND OF TRUST", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text("ESTIMATE", { align: "center", underline: true });
  doc.moveDown();
  
  // Date
  doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
  doc.moveDown();

  // Content Table-ish
  const startX = 50;
  let currentY = doc.y;
  
  const drawRow = (label, value) => {
      doc.text(label, startX, currentY);
      doc.text(value, startX + 200, currentY);
      currentY += 20;
  };
  
  drawRow("Name:", lead.customerName);
  drawRow("Project Name:", projectName || "N/A");
  drawRow("Plot No:", payload.plotNo || "N/A");
  drawRow("Area:", `${area} sq.ft`);
  drawRow("Rate:", `Rs. ${rate}/sq.ft`);
  doc.moveDown(); currentY += 10;
  
  doc.font('Helvetica-Bold');
  drawRow("Total (Basic Cost):", `Rs. ${basicCost.toLocaleString()}`);
  doc.font('Helvetica');
  doc.moveDown(); currentY += 10;
  
  drawRow("Down Payment:", `Rs. ${downPayment.toLocaleString()}`);
  drawRow("Balance Amount:", `Rs. ${balanceAmount.toLocaleString()}`);
  doc.moveDown(); currentY += 10;
  
  drawRow("Registry Amount:", `Rs. ${registry.toLocaleString()}`);
  drawRow("Stamp Duty (6% approx):", `Rs. ${stamp.toLocaleString()}`);
  drawRow("Miscellaneous / Legal:", `Rs. ${misc.toLocaleString()}`);
  
  doc.moveDown(); currentY += 20;
  doc.fontSize(14).font('Helvetica-Bold');
  drawRow("Final Total Amount:", `Rs. ${finalTotalAmount.toLocaleString()}`);
  
  // Footer
  doc.fontSize(10).font('Helvetica');
  doc.text("Authorized Signatory", 50, 700);
  doc.text("Contact Number: " + (lead.mobile || ""), 400, 700);
  
  doc.end();
  
  // Wait for stream to finish
  await new Promise((resolve) => stream.on("finish", resolve));
  
  // 4. Save to DB
  const quotation = await Quotation.create({
      lead: lead._id,
      customerName: lead.customerName,
      projectName,
      plotNo: payload.plotNo,
      area, rate, basicCost,
      downPayment, balanceAmount,
      registryAmount: registry,
      stampDuty: stamp,
      miscellaneous: misc,
      finalTotalAmount,
      pdfPath: `/uploads/${filename}`,
      createdBy: userId
  });
  
  return {
      statusCode: 201,
      message: "Quotation generated successfully",
      data: quotation
  };
};

export const listQuotationsService = async (leadId) => {
    const query = leadId ? { lead: leadId } : {};
    const data = await Quotation.find(query).sort({ createdAt: -1 });
    return {
        statusCode: 200,
        data
    };
};
