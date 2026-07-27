import type { Squad } from "@/types/squad";
import type { ItineraryResponse } from "@/types/itinerary";
import { formatRupee } from "./currency";
import { formatDate, getDays } from "./dates";

interface PdfData {
  squad: Squad;
  itinerary?: ItineraryResponse | null;
  emergencyInfo?: { police: string; ambulance: string; fire: string; nearestHospital: string } | null;
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function generateTripPdf(data: PdfData): Promise<void> {
  const { squad, itinerary, emergencyInfo } = data;

  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed; top: -9999px; left: -9999px;
    width: 800px; padding: 48px 40px;
    background: #fff; color: #2D2A24;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  `;

  container.innerHTML = `
    <div style="border-bottom: 3px solid #D4836A; padding-bottom: 16px; margin-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;">
        VOYAQ
      </h1>
      <p style="font-size: 11px; color: #888; margin: 4px 0 0;">Trip Summary & Itinerary</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 4px;">${esc(squad.name)}</h2>
      <p style="font-size: 14px; color: #D4836A; font-weight: 600; margin: 0;">
        ${esc(squad.lockedDestination || squad.destination || "—")}
      </p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 12px; background: #f5f5f0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #888; width: 30%;">Dates</td>
        <td style="padding: 8px 12px; font-size: 14px; font-weight: 600;">
          ${squad.lockedDates ? `${formatDate(squad.lockedDates.start)} – ${formatDate(squad.lockedDates.end)} (${getDays(squad.lockedDates.start, squad.lockedDates.end)} days)` : "—"}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f5f5f0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #888;">Budget</td>
        <td style="padding: 8px 12px; font-size: 14px; font-weight: 600;">
          ${squad.lockedBudget ? `${formatRupee(squad.lockedBudget)} / person` : "—"}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f5f5f0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #888;">Squad</td>
        <td style="padding: 8px 12px; font-size: 14px; font-weight: 600;">
          ${squad.members.length} members
        </td>
      </tr>
    </table>

    <div style="margin-bottom: 8px;">
      <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #D4836A; margin: 0 0 4px;">Squad Members</h3>
      <p style="font-size: 13px; margin: 0;">
        ${squad.members.map((m) => esc(m.name)).join(", ")}
      </p>
    </div>

    ${itinerary && itinerary.days?.length ? `
      <div style="border-top: 2px solid #2D2A24; margin: 24px 0 16px; padding-top: 16px;">
        <h3 style="font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px;">
          AI Itinerary (${itinerary.days.length} days)
        </h3>
        ${itinerary.days.map((day) => `
          <div style="margin-bottom: 16px; border: 1px solid #e0ddd7; border-radius: 8px; padding: 12px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 14px; font-weight: 700;">
                Day ${day.day} — ${day.title}
              </span>
              <span style="font-size: 12px; color: #888;">${day.date}</span>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              ${day.entries.map((entry) => `
                <tr>
                  <td style="padding: 4px 8px 4px 0; width: 60px; font-weight: 600; vertical-align: top;">${entry.time}</td>
                  <td style="padding: 4px 8px 4px 0; vertical-align: top;">
                    <span style="font-weight: 600;">${entry.activity}</span>
                    <span style="color: #888; display: block;">${entry.description}</span>
                  </td>
                  <td style="padding: 4px 0 4px 8px; text-align: right; white-space: nowrap; vertical-align: top;">${formatRupee(entry.estimatedCost)}</td>
                </tr>
              `).join("")}
            </table>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e0ddd7; display: flex; justify-content: space-between; font-size: 12px;">
              <span style="color: #888;">Daily budget: ${formatRupee(day.dailyBudget)}</span>
              <span style="font-weight: 600;">Day total: ${formatRupee(day.entries.reduce((s, e) => s + e.estimatedCost, 0))}</span>
            </div>
          </div>
        `).join("")}
        <p style="font-size: 13px; font-weight: 700; text-align: right; margin: 8px 0 0;">
          Total estimated: ${formatRupee(itinerary.totalEstimatedCost)}
        </p>
      </div>
    ` : ""}

    ${emergencyInfo ? `
      <div style="border-top: 2px solid #2D2A24; margin: 24px 0 16px; padding-top: 16px;">
        <h3 style="font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #DC2626; margin: 0 0 12px;">
          Emergency Contacts
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr><td style="padding: 4px 8px; font-weight: 600;">Police</td><td style="padding: 4px 8px;">${emergencyInfo.police}</td></tr>
          <tr><td style="padding: 4px 8px; font-weight: 600;">Ambulance</td><td style="padding: 4px 8px;">${emergencyInfo.ambulance}</td></tr>
          <tr><td style="padding: 4px 8px; font-weight: 600;">Fire</td><td style="padding: 4px 8px;">${emergencyInfo.fire}</td></tr>
          <tr><td style="padding: 4px 8px; font-weight: 600;">Nearest Hospital</td><td style="padding: 4px 8px;">${emergencyInfo.nearestHospital}</td></tr>
        </table>
      </div>
    ` : ""}

    <div style="border-top: 1px solid #e0ddd7; margin-top: 32px; padding-top: 16px; text-align: center;">
      <p style="font-size: 10px; color: #aaa; margin: 0;">
        Generated by VOYAQ · ${new Date().toLocaleDateString("en-IN")}
      </p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;
    const pageHeight = 297;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`VOYAQ-${squad.name.replace(/\s+/g, "-")}-Trip.pdf`);
  } catch {
    // PDF generation failed silently
  } finally {
    document.body.removeChild(container);
  }
}
