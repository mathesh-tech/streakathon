"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { generateReportData } from "@/actions/analytics";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ReportGenerator() {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'STUDENTS' | 'HACKATHON'>('STUDENTS');
  const [format, setFormat] = useState<'CSV' | 'EXCEL' | 'PDF' | 'JSON'>('CSV');

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const data = await generateReportData(reportType);
      if (!data || data.length === 0) {
        alert("No data available to export.");
        return;
      }

      const fileName = `${reportType}_REPORT_${new Date().toISOString().split('T')[0]}`;

      if (format === 'JSON') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        downloadBlob(blob, `${fileName}.json`);
      } 
      else if (format === 'CSV') {
        const csv = generateCSV(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        downloadBlob(blob, `${fileName}.csv`);
      }
      else if (format === 'EXCEL') {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      }
      else if (format === 'PDF') {
        const doc = new jsPDF();
        doc.text(`${reportType} Report`, 14, 15);
        
        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) => Object.values(obj).map((v: any) => String(v)));
        
        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: 20,
          styles: { fontSize: 8 },
        });
        
        doc.save(`${fileName}.pdf`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (objArray: any[]) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    const headers = Object.keys(array[0]).join(',');
    str += headers + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line !== '') line += ',';
        // Enclose in quotes to handle commas within values
        line += `"${array[i][index]}"`;
      }
      str += line + '\r\n';
    }
    return str;
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", name);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl flex flex-col justify-between border-t-4 border-t-purple-500">
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-400" /> Report Generator
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full bg-background border border-border/50 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="STUDENTS">All Students Report</option>
              <option value="HACKATHON">Active Hackathon Report</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Export Format</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['CSV', 'EXCEL', 'PDF', 'JSON'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f as any)}
                  className={`py-2 text-xs font-bold rounded-md border transition-colors ${
                    format === f 
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                      : 'bg-background/50 border-border/50 hover:bg-black/5 text-muted-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleExport}
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors bg-purple-600 text-white shadow hover:bg-purple-700 h-11 px-4"
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
        Generate & Download
      </button>
    </div>
  );
}
