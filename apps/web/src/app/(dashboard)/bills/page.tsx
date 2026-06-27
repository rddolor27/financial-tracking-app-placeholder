'use client';

export default function BillsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bill Reminders</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-zinc-500">Manage your recurring bills and reminders.</p>
        <p className="text-sm text-zinc-400 mt-2">Never miss a payment deadline.</p>
      </div>
    </div>
  );
}
