
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import Quotation from "../models/Quotation.js";
// import { Lead } from "../models/Lead.js";
// import Project from "../models/Project.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// export const createQuotationService = async (payload, userId) => {
//   const lead = await Lead.findById(payload.lead);
//   if (!lead) throw new Error("Lead not found");

//   let projectName = payload.projectName;
//   if (!projectName && lead.interestedProject) {
//     const proj = await Project.findById(lead.interestedProject);
//     if (proj) projectName = proj.projectName;
//   }

//   const rate = parseFloat(payload.rate) || 0;
//   const area = parseFloat(payload.area) || 0;
//   const basicCost = rate * area;

//   const downPayment = parseFloat(payload.downPayment) || 0;
//   const balanceAmount = basicCost - downPayment;

//   const registry = parseFloat(payload.registryAmount) || 0;
//   const stamp = parseFloat(payload.stampDuty) || 0;
//   const misc = parseFloat(payload.miscellaneous) || 0;

//   const finalTotalAmount = basicCost + registry + stamp + misc;

//   const filename = `quotation_${lead._id}_${Date.now()}.pdf`;
//   const uploadDir = path.join(__dirname, "../../uploads");
//   if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//   const filePath = path.join(uploadDir, filename);

//   const PAGE_WIDTH = 595.28;
//   const PAGE_HEIGHT = 841.89;

//   const doc = new PDFDocument({
//     size: "A4",
//     margin: 0,
//     autoFirstPage: false,
//   });

//   // 🛡️ Prevent second page
//   doc.on("pageAdded", () => {
//     doc.switchToPage(0);
//   });

//   const stream = fs.createWriteStream(filePath);
//   doc.pipe(stream);
//   doc.addPage({ size: "A4", margin: 0 });

//   // COLORS
//   const C_DARK = "#0F172A";
//   const C_GOLD = "#D97706";
//   const C_GRAY = "#64748B";
//   const C_LIGHT = "#F8FAFC";
//   const C_BORDER = "#E2E8F0";

//   // ===== WATERMARK SAFE =====
//   doc.save();
//   doc.rotate(-45, { origin: [PAGE_WIDTH / 2, PAGE_HEIGHT / 2] });
//   doc
//     .fontSize(60)
//     .font("Helvetica-Bold")
//     .fillColor("#F1F5F9")
//     .opacity(0.3)
//     .text("DIVINE SQUARE INFRA", -50, 350, {
//       width: 700,
//       align: "center",
//       lineBreak: false,
//     });
//   doc.restore();

//   // ===== HEADER =====
//   doc.rect(0, 0, PAGE_WIDTH, 100).fill(C_DARK);

//   doc
//     .fontSize(24)
//     .font("Helvetica-Bold")
//     .fillColor("#FFFFFF")
//     .text("DIVINE SQUARE INFRA", 40, 30, { lineBreak: false });

//   doc
//     .fontSize(9)
//     .fillColor(C_GOLD)
//     .text("BUILDING DREAMS INTO REALITY", 40, 58, {
//       characterSpacing: 2,
//       lineBreak: false,
//     });

//   doc
//     .fontSize(9)
//     .fillColor("#94A3B8")
//     .text("Nagpur, Maharashtra | +91 87671 60868", 40, 75, {
//       lineBreak: false,
//     });

//   doc.roundedRect(420, 30, 140, 26, 4).fill(C_GOLD);
//   doc
//     .fontSize(12)
//     .fillColor("#FFFFFF")
//     .text("QUOTATION", 420, 37, { align: "center", width: 140, lineBreak: false });

//   doc
//     .fontSize(9)
//     .fillColor("#94A3B8")
//     .text(`Date: ${new Date().toLocaleDateString()}`, 420, 65, {
//       align: "right",
//       width: 140,
//       lineBreak: false,
//     });

//   // ===== INFO CARDS =====
//   let cursorY = 110;
//   const colWidth = 250;

//   const drawCard = (title, x, y, contentFn) => {
//     doc.roundedRect(x, y, colWidth, 85, 4).fill(C_LIGHT);
//     doc.rect(x, y, 4, 85).fill(C_GOLD);
//     doc
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .fillColor(C_DARK)
//       .text(title, x + 15, y + 10, { lineBreak: false });
//     contentFn(x + 15, y + 28);
//   };

//   drawCard("CLIENT DETAILS", 40, cursorY, (tx, ty) => {
//     doc
//       .fontSize(10)
//       .font("Helvetica-Bold")
//       .fillColor(C_DARK)
//       .text(lead.customerName, tx, ty, {
//         width: 180,
//         ellipsis: true,
//         lineBreak: false,
//       });

//     doc
//       .fontSize(9)
//       .font("Helvetica")
//       .fillColor(C_GRAY)
//       .text(lead.mobile || "No Contact", tx, ty + 15, {
//         lineBreak: false,
//       });
//   });

//   drawCard("PROPERTY DETAILS", 305, cursorY, (tx, ty) => {
//     doc
//       .fontSize(10)
//       .font("Helvetica-Bold")
//       .fillColor(C_DARK)
//       .text(projectName || "Project N/A", tx, ty, {
//         width: 180,
//         ellipsis: true,
//         lineBreak: false,
//       });

//     doc
//       .fontSize(9)
//       .fillColor(C_GRAY)
//       .text(`Plot No: ${payload.plotNo || "-"}`, tx, ty + 15, {
//         lineBreak: false,
//       });

//     doc.text(`${area} sq.ft @ Rs.${rate}/sq.ft`, tx, ty + 30, {
//       lineBreak: false,
//     });
//   });

//   cursorY += 100;

//   // ===== TABLE =====
//   const tableX = 40;
//   const tableW = 515;

//   doc.rect(tableX, cursorY, tableW, 25).fill(C_DARK);
//   doc.fontSize(9).fillColor("#FFFFFF");
//   doc.text("DESCRIPTION", tableX + 15, cursorY + 8, { lineBreak: false });
//   doc.text("AMOUNT (INR)", tableX + 380, cursorY + 8, {
//     align: "right",
//     width: 120,
//     lineBreak: false,
//   });

//   cursorY += 25;

//   const drawRow = (label, amount) => {
//     doc.fontSize(10).fillColor(C_DARK);
//     doc.text(label, tableX + 15, cursorY + 8, {
//       width: 350,
//       ellipsis: true,
//       lineBreak: false,
//     });
//     doc.text(amount, tableX + 380, cursorY + 8, {
//       align: "right",
//       width: 120,
//       lineBreak: false,
//     });

//     doc
//       .moveTo(tableX, cursorY + 25)
//       .lineTo(tableX + tableW, cursorY + 25)
//       .strokeColor(C_BORDER)
//       .stroke();

//     cursorY += 25;
//   };

//   drawRow(`Basic Cost (${area} x ${rate})`, basicCost.toLocaleString());
//   if (registry) drawRow("Registry Charges", registry.toLocaleString());
//   if (stamp) drawRow("Stamp Duty", stamp.toLocaleString());
//   if (misc) drawRow("Misc Charges", misc.toLocaleString());

//   doc.rect(tableX, cursorY, tableW, 30).fill(C_DARK);
//   doc.fillColor("#FFFFFF").fontSize(12);
//   doc.text("GRAND TOTAL", tableX + 15, cursorY + 10, { lineBreak: false });
//   doc.text(`Rs. ${finalTotalAmount.toLocaleString()}`, tableX + 380, cursorY + 10, {
//     align: "right",
//     width: 120,
//     lineBreak: false,
//   });

//   cursorY += 60;

//   // ===== PAYMENT BOX =====
//   doc.fontSize(11).fillColor(C_DARK).text("PAYMENT SCHEDULE", 40, cursorY, {
//     lineBreak: false,
//   });

//   cursorY += 25;

//   doc.roundedRect(40, cursorY, 260, 60, 4).stroke(C_BORDER);

//   doc.text("Down Payment", 55, cursorY + 10, { lineBreak: false });
//   doc.text(`Rs. ${downPayment.toLocaleString()}`, 200, cursorY + 10, {
//     width: 80,
//     align: "right",
//     lineBreak: false,
//   });

//   doc.text("Balance Amount", 55, cursorY + 35, { lineBreak: false });
//   doc.fillColor(C_GOLD).text(`Rs. ${balanceAmount.toLocaleString()}`, 200, cursorY + 35, {
//     width: 80,
//     align: "right",
//     lineBreak: false,
//   });

//   // ===== FOOTER =====
//   const footerStart = PAGE_HEIGHT - 90;

//   doc.fillColor(C_GRAY).fontSize(8);
//   doc.text("* Valid for 7 days only", 40, footerStart, { lineBreak: false });
//   doc.text("* Subject to change", 40, footerStart + 12, { lineBreak: false });

//   doc.fillColor(C_DARK).fontSize(10);
//   doc.text("For Divine Square Infra", 400, footerStart, { lineBreak: false });

//   doc.rect(400, footerStart + 30, 150, 0.5).stroke(C_BORDER);
//   doc.fontSize(8).text("Authorized Signatory", 400, footerStart + 35, {
//     lineBreak: false,
//   });

//   doc.end();
//   await new Promise((resolve) => stream.on("finish", resolve));

//   const quotation = await Quotation.create({
//     lead: lead._id,
//     customerName: lead.customerName,
//     projectName,
//     plotNo: payload.plotNo,
//     area,
//     rate,
//     basicCost,
//     downPayment,
//     balanceAmount,
//     registryAmount: registry,
//     stampDuty: stamp,
//     miscellaneous: misc,
//     finalTotalAmount,
//     pdfPath: `/uploads/${filename}`,
//     createdBy: userId,
//   });

//   return {
//     statusCode: 201,
//     message: "Quotation generated successfully",
//     data: quotation,
//   };
// };















// export const listQuotationsService = async (leadId) => {
//     const query = leadId ? { lead: leadId } : {};
//     const data = await Quotation.find(query).sort({ createdAt: -1 });
//     return {
//         statusCode: 200,
//         data
//     };
// };









import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Quotation from "../models/Quotation.js";
import { Lead } from "../models/Lead.js";
import Project from "../models/Project.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// CREATE QUOTATION SERVICE
// =============================
export const createQuotationService = async (payload, userId) => {
  const lead = await Lead.findById(payload.lead);
  if (!lead) throw new Error("Lead not found");

  let projectName = payload.projectName;
  if (!projectName && lead.interestedProject) {
    const proj = await Project.findById(lead.interestedProject);
    if (proj) projectName = proj.projectName;
  }

  // ===== CALCULATIONS =====
  const rate = parseFloat(payload.rate) || 0;
  const area = parseFloat(payload.area) || 0;
  const basicCost = rate * area;

  const downPayment = parseFloat(payload.downPayment) || 0;
  const balanceAmount = basicCost - downPayment;

  const registry = parseFloat(payload.registryAmount) || 0;
  const stamp = parseFloat(payload.stampDuty) || 0;
  const misc = parseFloat(payload.miscellaneous) || 0;

  const finalTotalAmount = basicCost + registry + stamp + misc;

  // ===== FILE SETUP =====
  const filename = `quotation_${lead._id}_${Date.now()}.pdf`;
  const uploadDir = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);

  // =============================
  // PDF START
  // =============================

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;

  const doc = new PDFDocument({
    size: "A4",
    margin: 0,
    autoFirstPage: false
  });

  // prevent accidental 2nd page
  doc.on("pageAdded", () => doc.switchToPage(0));

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);
  doc.addPage();

  // COLORS
  const BRAND = "#0B1C2D";
  const ACCENT = "#C89B3C";
  const TEXT = "#1F2937";
  const MUTED = "#6B7280";
  const BORDER = "#E5E7EB";
  const LIGHT = "#F9FAFB";

  // ===== TOP STRIP =====
  doc.rect(0, 0, PAGE_WIDTH, 12).fill(ACCENT);

  // ===== HEADER =====
  doc.font("Helvetica-Bold")
     .fontSize(22)
     .fillColor(BRAND)
     .text("DIVINE SQUARE INFRA", 40, 30, { lineBreak:false });

  doc.fontSize(10)
     .fillColor(MUTED)
     .text("Real Estate & Land Development", 40, 55, { lineBreak:false });

  doc.fontSize(9)
     .text("Nagpur • +91 87671 60868 • www.divinesquareinfra.com", 40, 70, { lineBreak:false });

  // QUOTATION BADGE
  doc.roundedRect(400, 30, 155, 40, 6).fill(BRAND);
  doc.fillColor("#fff")
     .fontSize(14)
     .text("QUOTATION", 400, 38, { width:155, align:"center", lineBreak:false });

  doc.fontSize(9)
     .text(new Date().toLocaleDateString(), 400, 56, { width:155, align:"center", lineBreak:false });

  // ===== CLIENT + PROPERTY BOXES =====
  let y = 110;

  const box = (x, title, lines) => {
    doc.roundedRect(x, y, 250, 90, 6).stroke(BORDER);

    doc.fontSize(9)
       .fillColor(ACCENT)
       .text(title, x+15, y+10, { lineBreak:false });

    let ly = y + 30;
    lines.forEach(l => {
      doc.fontSize(10)
         .fillColor(TEXT)
         .text(l, x+15, ly, { lineBreak:false, ellipsis:true });
      ly += 16;
    });
  };

  box(40, "CLIENT DETAILS", [
    lead.customerName,
    lead.mobile || "No Contact"
  ]);

  box(305, "PROPERTY DETAILS", [
    projectName || "Project N/A",
    `Plot No: ${payload.plotNo || "-"}`,
    `${area} sq.ft @ ₹${rate}`
  ]);

  y += 120;

  // ===== COST TABLE =====
  const tableX = 40;
  const tableW = 515;

  doc.roundedRect(tableX, y, tableW, 32, 6).fill(LIGHT);
  doc.fillColor(TEXT)
     .fontSize(11)
     .font("Helvetica-Bold")
     .text("Cost Breakdown", tableX+15, y+10, { lineBreak:false });

  y += 45;

  const row = (label, value) => {
    doc.fontSize(10).font("Helvetica").fillColor(TEXT);
    doc.text(label, tableX+10, y, { lineBreak:false, ellipsis:true });
    doc.text(`₹ ${value.toLocaleString()}`, tableX+380, y, {
      width:120,
      align:"right",
      lineBreak:false
    });

    doc.moveTo(tableX, y+18)
       .lineTo(tableX+tableW, y+18)
       .strokeColor(BORDER)
       .stroke();

    y += 26;
  };

  row("Basic Cost", basicCost);
  if (registry) row("Registry Charges", registry);
  if (stamp) row("Stamp Duty", stamp);
  if (misc) row("Miscellaneous", misc);

  // ===== GRAND TOTAL =====
  doc.roundedRect(tableX, y+5, tableW, 40, 8).fill(BRAND);

  doc.fillColor("#fff")
     .fontSize(12)
     .font("Helvetica-Bold")
     .text("GRAND TOTAL", tableX+15, y+18, { lineBreak:false });

  doc.text(`₹ ${finalTotalAmount.toLocaleString()}`, tableX+350, y+18, {
    width:150,
    align:"right",
    lineBreak:false
  });

  y += 70;

  // ===== PAYMENT SUMMARY =====
  doc.fontSize(11)
     .fillColor(TEXT)
     .text("Payment Summary", 40, y, { lineBreak:false });

  y += 25;

  doc.roundedRect(40, y, 250, 70, 6).stroke(BORDER);

  doc.fontSize(10).fillColor(MUTED)
     .text("Down Payment", 55, y+15, { lineBreak:false });

  doc.fontSize(11).fillColor(TEXT)
     .text(`₹ ${downPayment.toLocaleString()}`, 200, y+15, {
       width:70, align:"right", lineBreak:false
     });

  doc.text("Balance", 55, y+40, { lineBreak:false });

  doc.fillColor(ACCENT)
     .font("Helvetica-Bold")
     .text(`₹ ${balanceAmount.toLocaleString()}`, 200, y+40, {
       width:70, align:"right", lineBreak:false
     });

  // ===== FOOTER =====
  const fy = PAGE_HEIGHT - 80;

  doc.fillColor(MUTED)
     .fontSize(8)
     .font("Helvetica")
     .text("• Valid for 7 days", 40, fy, { lineBreak:false });

  doc.text("• Govt. charges extra if applicable", 40, fy+12, { lineBreak:false });

  doc.fillColor(TEXT)
     .fontSize(10)
     .font("Helvetica-Bold")
     .text("Authorized Signatory", 400, fy+25, { lineBreak:false });

  doc.moveTo(400, fy+20).lineTo(540, fy+20).stroke(BORDER);

  doc.rect(0, PAGE_HEIGHT-15, PAGE_WIDTH, 15).fill(BRAND);

  doc.end();

  await new Promise(res => stream.on("finish", res));

  // =============================
  // SAVE DB
  // =============================
  const quotation = await Quotation.create({
    lead: lead._id,
    customerName: lead.customerName,
    projectName,
    plotNo: payload.plotNo,
    area,
    rate,
    basicCost,
    downPayment,
    balanceAmount,
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

// =============================
// LIST QUOTATIONS SERVICE
// =============================
export const listQuotationsService = async (leadId) => {
  const query = leadId ? { lead: leadId } : {};
  const data = await Quotation.find(query).sort({ createdAt: -1 });

  return {
    statusCode: 200,
    data
  };
};

