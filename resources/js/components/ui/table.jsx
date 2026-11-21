import * as React from 'react';
import { ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const Table = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <div className={cn('table-scroll no-scrollbar relative w-full overflow-x-auto', containerClassName)}>
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-xs text-left border-collapse min-w-full', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('divide-y divide-slate-100 [&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t border-slate-200 bg-slate-50/50 font-medium text-slate-700', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-slate-100 transition-colors hover:bg-slate-50/70 data-[state=selected]:bg-slate-100',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-3 py-2.5 text-left align-middle text-[11px] font-bold text-slate-700 tracking-wider whitespace-nowrap [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-3 py-2.5 align-middle text-slate-700 text-xs [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-xs text-slate-400', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

const TableEmpty = React.forwardRef(({ className, colSpan = 1, children = 'Tidak ada data ditemukan.', ...props }, ref) => (
  <TableRow ref={ref} className="hover:bg-transparent">
    <TableCell colSpan={colSpan} className={cn('h-28 text-center text-slate-400 text-xs', className)} {...props}>
      {children}
    </TableCell>
  </TableRow>
));
TableEmpty.displayName = 'TableEmpty';

/**
 * Atomic Table Filter & Toolbar Components
 * Menyediakan layout terstandarisasi untuk pencarian & dropdown filter tabel
 */

const TableToolbar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'p-4 border-b border-slate-200/80 bg-slate-50/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3',
      className
    )}
    {...props}
  />
));
TableToolbar.displayName = 'TableToolbar';

const TableSearch = React.forwardRef(({ className, containerClassName, placeholder = 'Cari data...', ...props }, ref) => (
  <div className={cn('relative flex-1 max-w-md w-full', containerClassName)}>
    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      className={cn(
        'w-full pl-9 pr-4 py-2 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400',
        'focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all',
        className
      )}
      {...props}
    />
  </div>
));
TableSearch.displayName = 'TableSearch';

const TableFilterGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-2 flex-wrap sm:flex-nowrap w-full lg:w-auto',
      className
    )}
    {...props}
  />
));
TableFilterGroup.displayName = 'TableFilterGroup';

const TableSelect = React.forwardRef(({ className, containerClassName, children, icon: Icon, ...props }, ref) => (
  <div className={cn('relative inline-flex items-center min-w-[130px]', containerClassName)}>
    {Icon && (
      <Icon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
    )}
    <select
      ref={ref}
      className={cn(
        'w-full appearance-none bg-white border border-slate-200 text-slate-700 text-xs rounded-lg py-2 h-9 font-medium transition-all cursor-pointer',
        'focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy',
        'hover:border-slate-300 hover:bg-slate-50/50',
        Icon ? 'pl-8 pr-8' : 'pl-3 pr-8',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
  </div>
));
TableSelect.displayName = 'TableSelect';

const TablePagination = React.forwardRef(({
  className,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  filteredCount,
  ...props
}, ref) => {
  const effectiveTotal = filteredCount !== undefined ? filteredCount : totalItems;
  const from = effectiveTotal === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, effectiveTotal);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      ref={ref}
      className={cn(
        'p-4 border-t border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs sm:text-sm text-slate-600',
        className
      )}
      {...props}
    >
      {/* Informasi Jumlah Record */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          Menampilkan <strong className="text-slate-900 font-semibold">{from} - {to}</strong> dari{' '}
          <strong className="text-slate-900 font-semibold">
            {filteredCount !== undefined && filteredCount !== totalItems ? `${filteredCount} (terfilter)` : totalItems}
          </strong> data
        </div>

        {/* Pilihan Baris per Halaman */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <span className="text-xs sm:text-sm text-slate-500 font-medium">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="h-8 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:border-navy focus:ring-1 focus:ring-navy cursor-pointer transition-all shadow-2xs"
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} baris
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigasi Nomor Halaman */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 hover:text-navy disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-1.5 text-slate-400 text-xs sm:text-sm">
                    ...
                  </span>
                );
              }
              const isActive = p === currentPage;
              return (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={cn(
                    'min-w-[34px] h-8.5 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center',
                    isActive
                      ? 'bg-navy text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 hover:text-navy disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Halaman Berikutnya"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
});
TablePagination.displayName = 'TablePagination';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
  TableToolbar,
  TableSearch,
  TableFilterGroup,
  TableSelect,
  TablePagination,
};
