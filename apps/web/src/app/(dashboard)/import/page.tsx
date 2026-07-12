'use client';

import { useState } from 'react';
import { importService } from '@/lib/api';
import { useAccounts, useCategories } from '@/lib/crud-hooks';
import type { ImportPreview } from '@financial-tracker/api-client';
import { Card, EmptyState } from '@/components/ui';

export default function ImportPage() {
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useCategories();
  const accounts = accountsData?.data ?? [];
  const categories = categoriesData ?? [];

  const [file, setFile] = useState<File | null>(null);
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePreview = async () => {
    if (!file || !accountId) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await importService.previewCsv(file, accountId);
      setPreview(data);
    } catch {
      setResult('Failed to parse CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!file || !accountId) return;
    setLoading(true);
    try {
      const data = await importService.confirmCsv(file, accountId, categoryId || undefined);
      setResult(`Successfully imported ${data.created} transactions.`);
      setPreview(null);
      setFile(null);
    } catch {
      setResult('Import failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';
  const labelCls = 'block text-[12px] font-semibold text-muted mb-1';

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div>
        <div className="font-bold text-[16px]">Import CSV</div>
        <div className="text-[12px] text-faint mt-0.5">Bring in transactions from a file</div>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>CSV file</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => { setFile(e.target.files?.[0] ?? null); setPreview(null); }}
              className="block w-full text-[13px] text-muted file:mr-4 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:text-[13px] file:font-semibold file:bg-primary-tint file:text-primary-light"
            />
          </div>
          <div>
            <label className={labelCls}>Account</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className={inputCls}>
              <option value="">Select account…</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Default category (optional)</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button onClick={handlePreview} disabled={!file || !accountId || loading} className="btn-p self-start disabled:opacity-50">
            {loading && !preview ? 'Parsing…' : 'Preview'}
          </button>
        </div>
      </Card>

      {preview && (
        <Card>
          <div className="font-bold text-[14.5px] mb-1">Preview</div>
          <p className="text-[12px] text-faint mb-3">
            {preview.rowCount} rows found, {preview.duplicates} potential duplicates
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Date', 'Description', 'Type', 'Amount'].map((h, i) => (
                    <th key={h} className={`text-[11px] font-bold text-faint uppercase tracking-[0.04em] pb-3 ${i === 3 ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-t border-line2 text-[13px]">
                    <td className="py-2.5 text-muted">{row.date}</td>
                    <td className="py-2.5 text-muted">{row.description}</td>
                    <td className="py-2.5">
                      <span style={{ color: row.type === 'income' ? 'var(--green-d)' : 'var(--red)' }}>{row.type}</span>
                    </td>
                    <td className="py-2.5 text-right mono">{row.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.rowCount > 10 && (
            <p className="text-[12px] text-faint mt-3">Showing first 10 of {preview.rowCount} rows</p>
          )}
          <button onClick={handleConfirm} disabled={loading} className="btn-p mt-4 disabled:opacity-50">
            {loading ? 'Importing…' : `Import ${preview.rowCount} transactions`}
          </button>
        </Card>
      )}

      {result && (
        <Card>
          <EmptyState>
            <span style={{ color: result.includes('Successfully') ? 'var(--green-d)' : 'var(--red)' }}>{result}</span>
          </EmptyState>
        </Card>
      )}
    </div>
  );
}
