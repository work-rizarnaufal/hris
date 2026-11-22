import React from 'react';
import { Building, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@/components/ui';

// Helper Status Badge
export function renderStatusBadge(status) {
  switch (status) {
    case 'Sangat Baik':
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
          Sangat Baik
        </Badge>
      );
    case 'Disiplin Baik':
      return (
        <Badge className="bg-sky-50 text-sky-700 border-sky-200 font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1 text-sky-600 inline" />
          Disiplin Baik
        </Badge>
      );
    case 'Perlu Pembinaan':
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600 inline" />
          Perlu Pembinaan
        </Badge>
      );
    case 'Peringatan / SP':
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-medium">
          <ShieldAlert className="w-3 h-3 mr-1 text-rose-600 inline" />
          Peringatan / SP
        </Badge>
      );
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export default function LaporanAnalyticsGrid({
  divisionChartData = [],
  selectedPeriod = '',
  topPerformers = [],
  warningList = [],
  onSelectEmployee,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Grafik Skor Disiplin Antar Divisi */}
      <Card className="lg:col-span-2 border-slate-200 shadow-2xs">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
                <Building className="w-4 h-4 text-[#c4a266]" />
                Rata-rata Skor Kedisiplinan per Divisi
              </CardTitle>
              <CardDescription className="text-xs">
                Perbandingan skor kepatuhan kehadiran pada periode {selectedPeriod}
              </CardDescription>
            </div>
            <Badge variant="neutral" className="text-[10px]">
              Skala 0 - 100%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  domain={[50, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit="%"
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val}% (Total ${item.payload.totalLate}x telat)`,
                    'Rata-rata Skor',
                  ]}
                  labelFormatter={(label, items) => items?.[0]?.payload?.fullName || label}
                  contentStyle={{
                    backgroundColor: '#10273f',
                    borderColor: '#10273f',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="avgScore" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {divisionChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.avgScore >= 95 ? '#10273f' : entry.avgScore >= 90 ? '#39609e' : '#c4a266'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Panel Sorotan Kinerja: Top Stars & Early Warning */}
      <div className="space-y-4">
        {/* Top Attendance Performers */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-bold text-navy flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Keteladanan Sempurna (100%)
              </span>
              <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                {topPerformers.length} Orang
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-2">
            {topPerformers.slice(0, 3).map((emp) => (
              <div
                key={emp.id}
                className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-900">{emp.name}</p>
                  <p className="text-[11px] text-slate-500">{emp.division}</p>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  Nihil Telat
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Early Warning Disiplin */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-bold text-navy flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-800">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Panggilan / Pembinaan Khusus
              </span>
              <Badge className="bg-rose-100 text-rose-800 text-[10px]">
                {warningList.length} Orang
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-2">
            {warningList.map((emp) => (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp.id)}
                className="p-2 rounded-lg bg-rose-50/40 border border-rose-200 hover:bg-rose-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">{emp.name}</span>
                    <span className="text-[10px] text-slate-500">({emp.nip})</span>
                  </div>
                  <p className="text-[11px] text-rose-700 font-medium">
                    {emp.lateCount}x Terlambat ({emp.totalLateMinutes} mnt)
                    {emp.alpaDays > 0 && ` • ${emp.alpaDays}x Alpa`}
                  </p>
                </div>
                {renderStatusBadge(emp.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
