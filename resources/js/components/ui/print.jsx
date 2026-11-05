import * as React from 'react';
import { Printer, X } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { Button } from './button.jsx';
import { Badge } from './badge.jsx';
import { Modal, ModalHeader, ModalBody } from './modal.jsx';

/**
 * Utilitas Pencetakan Laporan Terisolasi (Isolated Report Printing)
 * Mencetak hanya dokumen laporan melalui iframe tersembunyi tanpa menyertakan
 * shell halaman web, navbar, sidebar, atau elemen UI interaktif lainnya.
 */
export function printReportElement(elementId, title = 'Dokumen Laporan HCGA') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemen laporan #${elementId} tidak ditemukan.`);
    window.print();
    return;
  }

  // Kumpulkan seluruh link stylesheet dan style dokumen induk untuk menjaga font & utility classes
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('\n');

  // Hapus iframe sebelumnya jika ada
  const existingIframe = document.getElementById('report-print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }

  // Buat iframe terisolasi khusus cetak
  const iframe = document.createElement('iframe');
  iframe.id = 'report-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-9999';
  iframe.style.visibility = 'hidden';

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      ${stylesheets}
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm 12mm;
        }
        * {
          box-sizing: border-box !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #0f172a !important;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
        }
        .report-page-container {
          padding: 0 !important;
          margin: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
          box-shadow: none !important;
          border: none !important;
          background: #ffffff !important;
        }
        table {
          width: 100% !important;
          border-collapse: collapse !important;
        }
        thead {
          display: table-header-group !important;
        }
        tr, td, th {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      </style>
    </head>
    <body class="bg-white text-slate-900 p-0 m-0">
      <div class="report-page-container">
        ${element.innerHTML}
      </div>
    </body>
    </html>
  `);
  iframeDoc.close();

  // Waktu tunggu singkat untuk perenderan font dan stylesheet
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('Print iframe error:', err);
      window.print();
    }
  }, 350);
}

/**
 * Tombol Cetak Atomik
 */
export function PrintButton({
  children,
  label = 'Cetak Laporan',
  onClick,
  variant = 'outline',
  size = 'sm',
  className,
  icon,
  ...props
}) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      window.print();
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'gap-1.5 border-slate-300 text-navy hover:bg-slate-100 bg-white shadow-2xs print:hidden',
        className
      )}
      {...props}
    >
      {icon ?? <Printer className="w-4 h-4 text-slate-600" />}
      <span>{children ?? label}</span>
    </Button>
  );
}

/**
 * Modal Pratinjau Dokumen Laporan (Print Preview Modal)
 * Menampilkan lembar kerja fisik A4 sebelum dicetak ke printer / diekspor ke PDF.
 */
export function PrintPreviewModal({
  isOpen,
  onClose,
  title = 'Laporan HCGA',
  documentTitle,
  children,
  targetId = 'report-document-sheet',
  actions,
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    printReportElement(targetId, documentTitle || title);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" className="max-w-5xl">
      <ModalHeader
        icon={<Printer className="w-5 h-5 text-[#c4a266]" />}
        title="Pratinjau Dokumen Laporan"
        description="Periksa tata letak dan keabsahan dokumen laporan resmi sebelum dicetak atau diekspor ke PDF."
        onClose={onClose}
      />

      {/* Toolbar Kontrol Aksi Cetak */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Badge variant="neutral" className="bg-white border-slate-200 text-slate-700 font-medium text-[11px]">
            Format: Lembar Kerja A4
          </Badge>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="font-semibold text-navy truncate max-w-xs sm:max-w-md">
            {documentTitle || title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-8 px-3 text-slate-600 hover:text-navy"
          >
            Tutup
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handlePrint}
            className="text-xs h-8 px-4 gap-1.5 bg-[#10273f] hover:bg-[#1a3a5c] text-white shadow-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5 text-[#c4a266]" />
            <span>Cetak Dokumen Sekarang</span>
          </Button>
        </div>
      </div>

      {/* Area Lembar Kerja Dokumen A4 */}
      <ModalBody className="p-4 sm:p-6 bg-slate-100/70 overflow-y-auto max-h-[calc(85vh-140px)]">
        <div
          id={targetId}
          className="bg-white border border-slate-300 shadow-md p-6 sm:p-8 rounded-sm max-w-4xl mx-auto text-slate-900"
        >
          {children}
        </div>
      </ModalBody>
    </Modal>
  );
}

/**
 * Kop Surat Resmi Dokumen Laporan (Kop Surat HCGA)
 */
export function ReportHeader({
  company = 'PT RIAR KENCANA OPERASIONAL',
  division = 'DIVISI HUMAN CAPITAL & GENERAL AFFAIR (HCGA)',
  subtitle = 'Sistem Manajemen Presensi & Disiplin Operasional Terpadu',
  documentTitle = 'LAPORAN REKAPITULASI KEHADIRAN KARYAWAN',
  documentClassification = 'Klasifikasi: Dokumen Internal Terbatas',
  siteName,
  printDate,
  logo,
  className,
}) {
  const formattedDate =
    printDate ??
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className={cn('border-b-2 border-slate-900 pb-3 mb-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {logo ?? (
            <div className="w-11 h-11 rounded-xl bg-[#10273f] text-[#c4a266] flex items-center justify-center font-display font-bold text-base shadow-sm shrink-0">
              HC
            </div>
          )}
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              {company}
            </h1>
            <p className="text-xs font-bold text-[#10273f] mt-0.5">
              {division}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          <p className="font-bold text-slate-800 tracking-wider text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
            DOKUMEN RESMI HCGA
          </p>
          <p className="mt-1">
            Tanggal Cetak: <span className="font-medium text-slate-800">{formattedDate}</span>
          </p>
          {siteName && (
            <p>
              Unit Operasional: <span className="font-semibold text-slate-800">{siteName}</span>
            </p>
          )}
        </div>
      </div>

      {documentTitle && (
        <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="font-bold text-[#10273f] tracking-wide uppercase">
            {documentTitle}
          </span>
          {documentClassification && (
            <span className="text-slate-500 text-[10px] italic">
              {documentClassification}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Grid Metadata Parameter Laporan
 */
export function ReportMetaGrid({ items = [], className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 mb-5 text-xs',
        className
      )}
    >
      {items.map((item, idx) => (
        <div key={idx}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {item.label}
          </p>
          <p className="font-bold text-slate-800 mt-0.5 text-xs">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Lembar Pengesahan Resmi (Signatures)
 */
export function ReportSignature({
  signers = [],
  city = 'Sumedang',
  date,
  columns,
  className,
}) {
  const colCount = columns ?? (signers.length === 3 ? 3 : signers.length >= 4 ? 4 : 2);
  const gridClass =
    colCount === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : colCount === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2';

  const formattedDate =
    date ??
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className={cn('pt-6 mt-8 border-t border-slate-300 text-xs text-slate-800 break-inside-avoid', className)}>
      <div className="text-right text-[11px] text-slate-500 mb-4 italic">
        Ditetapkan di: {city}, {formattedDate}
      </div>
      <div className={cn('grid gap-8', gridClass)}>
        {signers.map((signer, index) => (
          <div key={index} className="text-center space-y-14">
            <div>
              <p className="font-semibold text-slate-800">{signer.role}</p>
              {signer.title && <p className="text-slate-500 text-[11px]">{signer.title}</p>}
            </div>
            <div>
              <p className="font-bold underline underline-offset-4 text-slate-900">{signer.name}</p>
              {signer.id && <p className="text-slate-500 text-[10px] mt-0.5">{signer.id}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Helper Wrapper
 */
export function PrintOnly({ children, className, ...props }) {
  return (
    <div className={cn('hidden print:block', className)} {...props}>
      {children}
    </div>
  );
}

export function PrintHidden({ children, className, ...props }) {
  return (
    <div className={cn('print:hidden', className)} {...props}>
      {children}
    </div>
  );
}

// Alias untuk kompatibilitas
export const PrintHeader = ReportHeader;
export const PrintSignature = ReportSignature;
