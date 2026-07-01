import { Inject, Injectable, type Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EXPORT_SERVICE } from './export.constants';

export interface ExportData {
  transactions: Array<{
    date: string;
    description: string | null;
    type: string;
    amount: number;
    category_id: string;
  }>;
}

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  async getExportData(userId: string, startDate: string, endDate: string): Promise<ExportData> {
    const transactions = await this.transactionsRepo.find({
      where: {
        user_id: userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });

    return {
      transactions: transactions.map((t) => ({
        date: t.date,
        description: t.description,
        type: t.type,
        amount: Number(t.amount),
        category_id: t.category_id,
      })),
    };
  }

  async exportCsv(userId: string, startDate: string, endDate: string): Promise<string> {
    const data = await this.getExportData(userId, startDate, endDate);

    const headers = 'Date,Description,Type,Amount';
    const rows = data.transactions.map(
      (t) => `${t.date},"${(t.description || '').replace(/"/g, '""')}",${t.type},${t.amount}`,
    );

    return [headers, ...rows].join('\n');
  }

  async exportExcel(userId: string, startDate: string, endDate: string): Promise<Buffer> {
    const data = await this.getExportData(userId, startDate, endDate);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Financial Tracker';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Transactions');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Amount', key: 'amount', width: 15 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A90D9' },
    };
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

    for (const t of data.transactions) {
      const row = sheet.addRow({
        date: t.date,
        description: t.description || '',
        type: t.type,
        amount: t.amount,
      });

      // Color income green, expense red
      const amountCell = row.getCell('amount');
      if (t.type === 'income') {
        amountCell.font = { color: { argb: 'FF22C55E' } };
      } else if (t.type === 'expense') {
        amountCell.font = { color: { argb: 'FFEF4444' } };
      }
    }

    // Add summary
    const totalIncome = data.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = data.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    sheet.addRow([]);
    sheet.addRow(['', 'Total Income', '', totalIncome]);
    sheet.addRow(['', 'Total Expenses', '', totalExpense]);
    sheet.addRow(['', 'Net', '', totalIncome - totalExpense]);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async exportPdf(userId: string, startDate: string, endDate: string): Promise<Buffer> {
    const data = await this.getExportData(userId, startDate, endDate);

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Financial Tracker - Transaction Report', 14, 22);

    doc.setFontSize(10);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);

    // Table
    const tableData = data.transactions.map((t) => [
      t.date,
      t.description || '',
      t.type,
      t.amount.toFixed(2),
    ]);

    autoTable(doc, {
      head: [['Date', 'Description', 'Type', 'Amount']],
      body: tableData,
      startY: 36,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [74, 144, 217] },
    });

    // Summary
    const totalIncome = data.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = data.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY ?? 50;

    doc.setFontSize(11);
    doc.text(`Total Income: ${totalIncome.toFixed(2)}`, 14, finalY + 12);
    doc.text(`Total Expenses: ${totalExpense.toFixed(2)}`, 14, finalY + 20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Net: ${(totalIncome - totalExpense).toFixed(2)}`, 14, finalY + 28);

    return Buffer.from(doc.output('arraybuffer'));
  }
}

export const InjectExportService = (): PropertyDecorator &
  ParameterDecorator => Inject(EXPORT_SERVICE);

export const ExportProvider: Provider = {
  provide: EXPORT_SERVICE,
  useClass: ExportService,
};
