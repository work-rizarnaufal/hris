import * as React from 'react';
import { cn } from '@/lib/utils.js';

const Table = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <div className={cn('table-scroll relative w-full overflow-auto no-scrollbar', containerClassName)}>
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-xs text-left', className)}
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
      'h-11 px-4 py-3 text-left align-middle text-[11px] font-bold text-slate-700 tracking-wider whitespace-nowrap [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle text-slate-700 [&:has([role=checkbox])]:pr-0', className)}
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
};

