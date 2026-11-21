<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Location;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class KaryawanController extends Controller
{
    public function index(): Response
    {
        $employees = Employee::with(['location', 'shift'])
            ->orderBy('id', 'asc')
            ->get();

        $locations = Location::where('status', 'Aktif')->get();
        $shifts = Shift::where('is_active', true)->get();

        return Inertia::render('Admin/Karyawan/DataKaryawan', [
            'employees' => $employees,
            'availableLocations' => $locations,
            'availableShifts' => $shifts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $this->resolvePayload($request->all());

        Validator::make($payload, [
            'nip' => ['required', 'string', 'max:50', 'unique:employees,nip'],
            'biometric_pin' => ['nullable', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role_title' => ['required', 'string', 'max:100'],
            'division' => ['nullable', 'string', 'max:100'],
            'location_id' => ['required', 'exists:locations,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'shift_group' => ['nullable', 'string'],
            'employment_status' => ['required', 'string'],
            'status' => ['required', 'string'],
        ])->validate();

        Employee::create($payload);
        $this->syncLocationCounts();

        return back()->with('success', 'Data karyawan baru berhasil ditambahkan.');
    }

    public function update(Request $request, Employee $karyawan): RedirectResponse
    {
        $payload = $this->resolvePayload($request->all(), $karyawan->id);

        Validator::make($payload, [
            'nip' => ['required', 'string', 'max:50', 'unique:employees,nip,'.$karyawan->id],
            'biometric_pin' => ['nullable', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role_title' => ['required', 'string', 'max:100'],
            'division' => ['nullable', 'string', 'max:100'],
            'location_id' => ['required', 'exists:locations,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'shift_group' => ['nullable', 'string'],
            'employment_status' => ['required', 'string'],
            'status' => ['required', 'string'],
        ])->validate();

        $karyawan->update($payload);
        $this->syncLocationCounts();

        return back()->with('success', 'Profil dan data karyawan berhasil diperbarui.');
    }

    public function destroy(Employee $karyawan): RedirectResponse
    {
        $karyawan->delete();
        $this->syncLocationCounts();

        return back()->with('success', 'Data karyawan berhasil dihapus dari sistem.');
    }

    public function batchImport(Request $request): RedirectResponse
    {
        $request->validate([
            'employees' => ['required', 'array', 'min:1'],
        ]);

        $importedCount = 0;
        DB::transaction(function () use ($request, &$importedCount) {
            $maxNum = $this->getMaxNipNumber();

            foreach ($request->input('employees') as $item) {
                if (empty($item['name'])) {
                    continue;
                }
                if (empty($item['nip'])) {
                    $maxNum++;
                    $item['nip'] = 'HC-'.str_pad((string) $maxNum, 4, '0', STR_PAD_LEFT);
                }
                $payload = $this->resolvePayload($item);

                Employee::updateOrCreate(
                    ['nip' => $payload['nip']],
                    $payload
                );
                $importedCount++;
            }
            $this->syncLocationCounts();
        });

        return back()->with('success', "Berhasil mengimpor {$importedCount} data karyawan ke dalam database.");
    }

    protected function resolvePayload(array $data, ?int $existingId = null): array
    {
        // Resolve location_id
        $locationId = $data['location_id'] ?? null;
        if (! $locationId && ! empty($data['location'])) {
            $locStr = (string) (is_array($data['location']) ? ($data['location']['name'] ?? '') : $data['location']);
            if (stripos($locStr, 'cimalaka') !== false) {
                $locationId = 2;
            } elseif (stripos($locStr, 'mariuk') !== false) {
                $locationId = 1;
            } else {
                $found = Location::where('name', 'like', "%{$locStr}%")->value('id');
                $locationId = $found ?: 1;
            }
        }
        $locationId = $locationId ? (int) $locationId : 1;

        // Resolve shift_id
        $shiftId = $data['shift_id'] ?? null;
        if (! empty($data['scheduleCategory']) || ! empty($data['shift'])) {
            $shiftStr = (string) ($data['scheduleCategory'] ?? (is_array($data['shift'] ?? null) ? ($data['shift']['name'] ?? '') : ($data['shift'] ?? '')));
            if (stripos($shiftStr, 'belum') !== false || $shiftStr === '-' || $shiftStr === '') {
                $shiftId = null;
            } elseif (stripos($shiftStr, 'malam') !== false) {
                $shiftId = 2;
            } elseif (stripos($shiftStr, 'kantor') !== false || stripos($shiftStr, 'fleksibel') !== false || stripos($shiftStr, 'office') !== false) {
                $shiftId = 3;
            } elseif (stripos($shiftStr, 'pagi') !== false) {
                $shiftId = 1;
            }
        }
        $shiftId = $shiftId ? (int) $shiftId : null;

        $nip = trim((string) ($data['nip'] ?? ''));
        if (empty($nip)) {
            $nip = $this->generateNextNip();
        }

        $biometricPin = $data['biometric_pin'] ?? $data['biometricPin'] ?? null;
        if (! $biometricPin && $nip) {
            $rawDigits = preg_replace('/\D/', '', $nip);
            $biometricPin = $rawDigits !== '' ? (string) (int) $rawDigits : null;
        }

        $div = trim((string) ($data['division'] ?? ''));
        $division = (! empty($div) && $div !== 'Belum Ditetapkan' && $div !== '-') ? $div : null;

        $grp = trim((string) ($data['shift_group'] ?? $data['group'] ?? ''));
        $shiftGroup = (! empty($grp)) ? $grp : 'Belum Ditetapkan';

        return [
            'nip' => $nip,
            'biometric_pin' => $biometricPin ? (string) $biometricPin : null,
            'name' => trim((string) ($data['name'] ?? 'Karyawan Baru')),
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'role_title' => trim((string) ($data['role_title'] ?? $data['role'] ?? 'Staff Operasional Lapangan')),
            'division' => $division,
            'location_id' => $locationId,
            'shift_id' => $shiftId,
            'shift_group' => $shiftGroup,
            'employment_status' => $data['employment_status'] ?? 'Tetap',
            'status' => $data['status'] ?? 'Aktif',
        ];
    }

    protected function getMaxNipNumber(): int
    {
        $maxNum = 0;
        $nips = Employee::where('nip', 'like', 'HC-%')->pluck('nip');
        foreach ($nips as $nip) {
            if (preg_match('/HC-(\d+)/', $nip, $m)) {
                $num = (int) $m[1];
                if ($num > $maxNum) {
                    $maxNum = $num;
                }
            }
        }

        return $maxNum > 0 ? $maxNum : (Employee::max('id') ?? 0);
    }

    protected function generateNextNip(): string
    {
        $next = $this->getMaxNipNumber() + 1;

        return 'HC-'.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    protected function syncLocationCounts(): void
    {
        foreach (Location::all() as $loc) {
            $loc->update(['assigned_count' => Employee::where('location_id', $loc->id)->count()]);
        }
    }
}
