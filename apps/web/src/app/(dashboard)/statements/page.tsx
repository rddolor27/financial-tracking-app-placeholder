'use client';

import { useRef, useState } from 'react';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';
import { Card, Chip, IconBox, EmptyState } from '@/components/ui';

type LocalUpload = { name: string; size: number };

export default function StatementsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<LocalUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const pdfs = Array.from(files)
      .filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
      .map((f) => ({ name: f.name, size: f.size }));
    if (pdfs.length) setUploads((prev) => [...pdfs, ...prev]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <div className="font-bold text-[16px]">Statements</div>
          <div className="text-[12px] text-faint mt-0.5">Upload a PDF and we&apos;ll extract transactions</div>
        </div>
        <div className="flex-1" />
        <button className="btn-p" onClick={() => inputRef.current?.click()}>
          <FiUploadCloud className="w-4 h-4" /> Upload PDF
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Dropzone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className="card cursor-pointer text-center"
        style={{
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: dragOver ? 'var(--primary)' : 'var(--line)',
          padding: 34,
        }}
      >
        <div
          className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[24px] mx-auto mb-3"
          style={{ background: 'var(--primary-tint)', color: 'var(--primary-light)' }}
        >
          <FiFileText />
        </div>
        <div className="font-bold text-[14px]">Drop a bank or credit-card PDF here</div>
        <div className="text-[12px] text-faint mt-1">
          Rule-based parsing first, AI fallback for complex layouts · max 10&nbsp;MB
        </div>
      </div>

      {/* Recent uploads */}
      <Card>
        <div className="font-bold text-[14.5px] mb-1.5">Recent uploads</div>
        {uploads.length === 0 ? (
          <EmptyState>No statements uploaded yet.</EmptyState>
        ) : (
          uploads.map((u, i) => (
            <div key={`${u.name}-${i}`} className="flex items-center gap-3 py-[11px] border-b border-line2 last:border-none">
              <IconBox bg="var(--red-tint)" color="var(--red)">
                <FiFileText className="w-4 h-4" />
              </IconBox>
              <div className="min-w-0">
                <div className="font-semibold text-[13px] truncate">{u.name}</div>
                <div className="text-[11px] text-faint mt-0.5">{(u.size / 1024).toFixed(0)} KB</div>
              </div>
              <div className="flex-1" />
              <Chip variant="amb">Ready to upload</Chip>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
