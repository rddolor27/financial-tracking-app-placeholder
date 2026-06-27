'use client';

import { useState } from 'react';
import { exportService } from '@/lib/api';

export default function ExportPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<string | null>(null);

  const download = async (format: 'csv' | 'excel' | 'pdf') => {
    setLoading(format);
    try {
      let blob: Blob;
      let filename: string;
      if (format === 'csv') {
        blob = await exportService.exportCsv(startDate, endDate);
        filename = `transactions_${startDate}_${endDate}.csv`;
      } else if (format === 'excel') {
        blob = await exportService.exportExcel(startDate, endDate);
        filename = `transactions_${startDate}_${endDate}.xlsx`;
      } else {
        blob = await exportService.exportPdf(startDate, endDate);
        filename = `transactions_${startDate}_${endDate}.pdf`;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Export Transactions</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Date Range</h2>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => download('csv')}
          disabled={!!loading}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-left hover:ring-2 ring-blue-500 transition disabled:opacity-50"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">CSV</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Spreadsheet-compatible format</p>
          {loading === 'csv' && <p className="text-sm text-blue-500 mt-2">Downloading...</p>}
        </button>

        <button
          onClick={() => download('excel')}
          disabled={!!loading}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-left hover:ring-2 ring-green-500 transition disabled:opacity-50"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Excel</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Styled workbook with summary</p>
          {loading === 'excel' && <p className="text-sm text-green-500 mt-2">Downloading...</p>}
        </button>

        <button
          onClick={() => download('pdf')}
          disabled={!!loading}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-left hover:ring-2 ring-red-500 transition disabled:opacity-50"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">PDF</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Printable transaction report</p>
          {loading === 'pdf' && <p className="text-sm text-red-500 mt-2">Downloading...</p>}
        </button>
      </div>
    </div>
  );
}
