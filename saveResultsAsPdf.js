import PDFDocument from "pdfkit";
import fs from "fs";

export function saveResultsAsPdf(results, url, outputPath = "report.pdf") {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  const now = new Date();
  const timestamp = now.toLocaleString();

  // Title
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("black")
    .text("Accessibility Audit Report", { align: "left" });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("gray")
    .text(`Generated: ${timestamp}`, { align: "left" })
    .text(`URL: ${url}`)
    .moveDown(1.5);

  if (results.length === 0) {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("green")
      .text("✅ No accessibility violations found.");
  } else {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("red")
      .text(`❗ Found ${results.length} accessibility issues:`);
    doc.moveDown();

    results.forEach((issue, i) => {
      const impact = issue.impact || "unknown";

      const color =
        impact === "critical"
          ? "red"
          : impact === "serious"
          ? "#FFA500"
          : impact === "moderate"
          ? "#1E90FF"
          : impact === "minor"
          ? "gray"
          : "black";

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("black")
        .text(`${i + 1}. ${issue.description}`);

      doc
        .font("Helvetica-Oblique")
        .fontSize(11)
        .fillColor(color)
        .text(`Impact: ${impact}`);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("black")
        .text(`Help: ${issue.help}`)
        .text(`Tags: ${issue.tags.join(", ")}`);

      doc.moveDown(1.2);
    });
  }

  // Footer
  doc
    .moveDown()
    .font("Helvetica-Oblique")
    .fontSize(9)
    .fillColor("gray")
    .text("Generated by accessibility-checker CLI", { align: "center" });

  doc.end();
  console.log(`📄 PDF report saved to ${outputPath}`);
}
