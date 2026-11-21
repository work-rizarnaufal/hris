import React from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

export default function TabGeofencingLokasi({
  locations,
  attendanceSettings,
  setAttendanceSettings,
  onUpdateRadius,
  onToggleStatus,
  onOpenEdit,
  setAlertInfo,
}) {
  const isGeofenceActive = attendanceSettings.enableGeofence !== false;

  const handleToggleMasterGeofence = () => {
    const nextState = !isGeofenceActive;
    setAttendanceSettings((prev) => ({
      ...prev,
      enableGeofence: nextState,
    }));
    setAlertInfo({
      type: nextState ? 'success' : 'warning',
      message: nextState
        ? 'Validasi geofence diaktifkan kembali. Presensi mobile wajib dalam radius lokasi.'
        : 'Validasi geofence dinonaktifkan. Karyawan dapat melakukan presensi tanpa batasan radius.',
    });
  };

  return (
    <div className="space-y-4">
      {/* Master Switch Banner Geofencing */}
      <Card
        className={`border transition-all ${
          isGeofenceActive
            ? 'border-emerald-200 bg-emerald-50/30'
            : 'border-amber-300 bg-amber-50/50'
        }`}
      >
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isGeofenceActive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isGeofenceActive ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">
                  {isGeofenceActive
                    ? 'Validasi Geofence Aktif'
                    : 'Validasi Geofence Dinonaktifkan (Bebas Lokasi)'}
                </h3>
                <Badge
                  className={
                    isGeofenceActive
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-xs'
                      : 'bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs'
                  }
                >
                  {isGeofenceActive ? 'Radius Terkunci' : 'Radius Nonaktif'}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {isGeofenceActive
                  ? 'Karyawan hanya dapat melakukan presensi jika smartphone berada di dalam radius koordinat site resmi (Mariuk & Cimalaka).'
                  : 'Karyawan dapat presensi dari mana saja tanpa batasan radius meter (koordinat GPS tetap terekam). Mode ini cocok untuk penugasan luar, WFH, atau saat darurat.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
            <Button
              type="button"
              variant={isGeofenceActive ? 'outline' : 'default'}
              size="sm"
              onClick={handleToggleMasterGeofence}
              className={`font-semibold cursor-pointer ${
                isGeofenceActive
                  ? 'border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {isGeofenceActive ? 'Nonaktifkan Geofence' : 'Aktifkan Kembali Geofence'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Titik Lokasi & Radius */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-navy flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c4a266]" />
              Titik Lokasi & Radius Geofence Presensi Mobile
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Titik koordinat dan batas radius meter per lokasi operasional pabrik dan site.
            </CardDescription>
          </div>

          <Badge
            className={
              isGeofenceActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-semibold self-start sm:self-auto'
                : 'bg-amber-50 text-amber-800 border-amber-200 text-xs font-semibold self-start sm:self-auto'
            }
          >
            {isGeofenceActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Status Service: Aktif (GPS Accurate)
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Status Service: Dinonaktifkan (Bypass Radius)
              </>
            )}
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-slate-200">
                <TableHead className="w-12 text-center text-xs font-semibold text-slate-600">No</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[200px]">Nama Lokasi Operasional</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[180px]">Koordinat GPS (Lat, Long)</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[160px]">Radius Valid (Meter)</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 min-w-[130px]">Personil Terdaftar</TableHead>
                <TableHead className="text-center text-xs font-semibold text-slate-600 w-28">Status Geofence</TableHead>
                <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600 min-w-[150px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {locations.map((loc, idx) => (
                <TableRow key={loc.id} className="text-xs hover:bg-slate-50/70">
                  <TableCell className="text-center font-medium text-slate-500">{idx + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-navy">{loc.name}</p>
                      <Badge
                        className={
                          loc.name.includes('Mariuk')
                            ? 'bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold px-1.5 py-0'
                            : loc.name.includes('Cimalaka')
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200 text-[10px] font-bold px-1.5 py-0'
                            : 'bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-medium px-1.5 py-0'
                        }
                      >
                        {loc.type || 'Pabrik'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">{loc.address}</p>
                  </TableCell>
                  <TableCell className="font-mono text-slate-700">
                    {loc.latitude}, {loc.longitude}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="20"
                        max="500"
                        step="10"
                        value={loc.radiusMeters}
                        onChange={(e) =>
                          onUpdateRadius(loc.id, e.target.value)
                        }
                        className="h-8 text-xs bg-white text-slate-800 font-mono w-24"
                      />
                      <span className="text-xs text-slate-500">Meter</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {loc.assignedCount ?? 0} Karyawan
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        loc.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                          : 'bg-slate-100 text-slate-500 border-slate-200 font-semibold'
                      }
                    >
                      {loc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenEdit(loc)}
                        className="h-7 text-[11px] px-2 font-medium cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50 gap-1"
                        title="Edit Parameter Geofence"
                      >
                        <Pencil className="w-3 h-3 text-[#c4a266]" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleStatus(loc.id)}
                        className="h-7 text-[11px] px-2 font-medium cursor-pointer"
                      >
                        {loc.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
