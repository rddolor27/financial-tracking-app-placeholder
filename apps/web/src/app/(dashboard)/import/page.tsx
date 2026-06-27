'use client';

import { useState } from 'react';
import { importService } from '@/lib/api';
import { useAccounts, useCategories } from '@/lib/crud-hooks';
import type { ImportPreview } from '@financial-tracker/api-client';

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import CSV</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setPreview(null); }}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select account...</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Category (optional)</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePreview}
          disabled={!file || !accountId || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && !preview ? 'Parsing...' : 'Preview'}
        </button>
      </div>

      {preview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Preview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {preview.rowCount} rows found, {preview.duplicates} potential duplicates
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{row.date}</td>
                    <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{row.description}</td>
                    <td className="py-2 pr-4">
                      <span className={row.type === 'income' ? 'text-green-600' : 'text-red-600'}>{row.type}</span>
                    </td>
                    <td className="py-2 text-right text-gray-700 dark:text-gray-300">{row.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.rowCount > 10 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Showing first 10 of {preview.rowCount} rows</p>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Importing...' : `Import ${preview.rowCount} Transactions`}
          </button>
        </div>
      )}

      {result && (
        <div className={`p-4 rounded-lg ${result.includes('Successfully') ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
          {result}
        </div>
      )}
    </div>
  );
}
