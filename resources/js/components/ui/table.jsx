import * as React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const Table = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <div className={cn('table-scroll relative w-full overflow-x-auto', containerClassName)}>
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
};
