import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header] ?? '';
                // Escape commas and quotes
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = (data: any[], title: string, filename: string) => {
    if (data.length === 0) return;

    const doc = new jsPDF();
    const headers = Object.keys(data[0]);

    // Brand Colors: #E7F0FA (light), #7BA4D0 (medium), #2E5E99 (primary), #0D2440 (dark)
    // Primary Blue: [46, 94, 153]
    // Dark Navy: [13, 36, 64]
    // Medium Blue: [123, 164, 208]

    // Add title
    doc.setFontSize(22);
    doc.setTextColor(13, 36, 64); // brand-dark
    doc.text(title, 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(123, 164, 208); // brand-medium
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Format data for autotable
    const body = data.map(item => headers.map(header => item[header]));

    autoTable(doc, {
        startY: 40,
        head: [headers.map(h => h.toUpperCase())],
        body: body,
        theme: 'striped',
        headStyles: {
            fillColor: [46, 94, 153], // brand-primary
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
            textColor: [13, 36, 64], // brand-dark
            lineColor: [231, 240, 250] // brand-light
        },
        alternateRowStyles: {
            fillColor: [231, 240, 250] // brand-light
        }
    });

    doc.save(`${filename}.pdf`);
};
