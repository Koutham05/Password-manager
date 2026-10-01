import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate PDF Vault Security Health & Audit Report
 */
export function generatePDFReport(stats, auditItems, masterAgeDays = 45) {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // Dark slate (#0f172a)
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('AEGIS VAULT SECURITY REPORT', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(`Generated on: ${currentDate} | Confidential Security Audit`, 14, 32);

  // Executive Summary Card
  let y = 50;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 35, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, y + 10);

  const healthScore = stats?.healthScore || 100;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Vault Security Score: ${healthScore} / 100`, 20, y + 20);
  doc.text(`Total Accounts Monitored: ${stats?.totalPasswords || 0}`, 20, y + 27);

  doc.text(`Master Password Age: ${masterAgeDays} days old`, 110, y + 20);
  doc.text(`Accounts Without 2FA: ${stats?.without2fa || 0}`, 110, y + 27);

  // Health Rating Badge
  if (healthScore >= 80) {
    doc.setFillColor(16, 185, 129); // Emerald
    doc.setTextColor(255, 255, 255);
    doc.rect(155, y + 6, 35, 8, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('HEALTHY', 163, y + 11.5);
  } else if (healthScore >= 50) {
    doc.setFillColor(245, 158, 11); // Amber
    doc.setTextColor(255, 255, 255);
    doc.rect(155, y + 6, 35, 8, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('WARNING', 162, y + 11.5);
  } else {
    doc.setFillColor(244, 63, 94); // Rose
    doc.setTextColor(255, 255, 255);
    doc.rect(155, y + 6, 35, 8, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AT RISK', 165, y + 11.5);
  }

  // Key Risk Metrics Table
  y += 45;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Vulnerability Breakdown', 14, y);

  autoTable(doc, {
    startY: y + 5,
    head: [['Metric / Risk Indicator', 'Count', 'Risk Level', 'Recommendation']],
    body: [
      ['Weak Passwords (< 10 chars)', stats?.weakCount || 0, (stats?.weakCount || 0) > 0 ? 'High' : 'Low', 'Update to 16+ char random passwords'],
      ['Reused Passwords across accounts', stats?.reusedCount || 0, (stats?.reusedCount || 0) > 0 ? 'Critical' : 'Low', 'Use unique passwords for each service'],
      ['Credentials Without 2FA Key', stats?.without2fa || 0, (stats?.without2fa || 0) > 0 ? 'Medium' : 'Low', 'Enable 2FA / TOTP authentication'],
      ['Outdated Passwords (> 90 Days)', auditItems.filter(i => i.isOld).length, 'Medium', 'Rotate passwords for sensitive services']
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9 }
  });

  // Account Audit Detail Table
  let finalY = (doc).lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Detailed Account Audit Items', 14, finalY);

  const tableRows = auditItems.map(item => [
    item.title || 'Untitled',
    item.username || '—',
    item.categoryName || 'General',
    `${item.daysOld} days`,
    item.isWeak ? 'Weak' : item.isReused ? 'Reused' : item.isOld ? 'Outdated' : 'Healthy'
  ]);

  autoTable(doc, {
    startY: finalY + 5,
    head: [['Account Title', 'Username / Email', 'Category', 'Age', 'Status']],
    body: tableRows.length > 0 ? tableRows : [['No accounts logged', '—', '—', '—', 'Healthy']],
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5 }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} — Aegis Vault Security Audit`, 14, 285);
  }

  doc.save(`Aegis_Security_Health_Report_${Date.now()}.pdf`);
}

/**
 * Generate CSV Security Audit Report Export
 */
export function generateCSVAuditReport(auditItems, stats) {
  let csv = 'Account Title,Username,Category,Password Age (Days),Weak Flag,Reused Flag,Outdated Flag,Status\n';
  
  auditItems.forEach(item => {
    const escape = (str) => `"${(str || '').replace(/"/g, '""')}"`;
    const status = item.isWeak ? 'Weak' : item.isReused ? 'Reused' : item.isOld ? 'Outdated' : 'Healthy';
    csv += `${escape(item.title)},${escape(item.username)},${escape(item.categoryName)},${item.daysOld},${item.isWeak ? 'YES' : 'NO'},${item.isReused ? 'YES' : 'NO'},${item.isOld ? 'YES' : 'NO'},${status}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Aegis_Security_Audit_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
