'use client';

import { useState } from 'react';
import { FiFileText, FiGrid, FiFile } from 'react-icons/fi';
import { exportService } from '@/lib/api';
import { Card } from '@/components/ui';

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

  const inputCls =
    'px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';

  const formats = [
    { key: 'csv' as const, icon: FiFileText, title: 'CSV', desc: 'Spreadsheet-compatible format' },
    { key: 'excel' as const, icon: FiGrid, title: 'Excel', desc: 'Styled workbook with summary' },
    { key: 'pdf' as const, icon: FiFile, title: 'PDF', desc: 'Printable transaction report' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="font-bold text-[16px]">Export transactions</div>
        <div className="text-[12px] text-faint mt-0.5">Download your data</div>
      </div>

      <Card>
        <div className="font-bold text-[14.5px] mb-3.5">Date range</div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-muted mb-1">Start date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-muted mb-1">End date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map(({ key, icon: Icon, title, desc }) => (
          <button
            key={key}
            onClick={() => download(key)}
            disabled={!!loading}
            className="card pad text-left hover:border-primary transition-colors disabled:opacity-50"
          >
            <div
              className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center mb-3"
              style={{ background: 'var(--primary-tint)', color: 'var(--primary-light)' }}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="font-bold text-[14.5px]">{title}</div>
            <p className="text-[12px] text-faint mt-1">{desc}</p>
            {loading === key && <p className="text-[12px] text-primary-light mt-2">Downloading…</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
