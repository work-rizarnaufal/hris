<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $roleInfo = match ($user?->role) {
            'super_admin' => [
                'role_key' => 'SUPER_ADMIN',
                'role_label' => 'Super Administrator HCGA',
                'short_title' => 'Super Admin',
                'unit' => 'Kantor Pusat & Lintas Site',
            ],
            'supervisor' => [
                'role_key' => 'SUPERVISOR',
                'role_label' => 'Supervisor Operasional Site',
                'short_title' => 'Supervisor Site',
                'unit' => 'Lokasi Cimalaka (Pabrik 2)',
            ],
            'karyawan' => [
                'role_key' => 'KARYAWAN',
                'role_label' => 'Senior Operator Lapangan',
                'short_title' => 'Personel Lapangan',
                'unit' => 'Lokasi Mariuk (Pabrik 1)',
            ],
            default => [
                'role_key' => 'SUPER_ADMIN',
                'role_label' => 'Super Administrator HCGA',
                'short_title' => 'Super Admin',
                'unit' => 'Kantor Pusat & Lintas Site',
            ],
        };

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'nip' => $user->nip,
                    'role_key' => $roleInfo['role_key'],
                    'role_label' => $roleInfo['role_label'],
                    'short_title' => $roleInfo['short_title'],
                    'unit' => $roleInfo['unit'],
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
