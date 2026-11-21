<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'location_id',
        'shift_id',
        'nip',
        'nik',
        'name',
        'email',
        'phone',
        'role_title',
        'division',
        'shift_group',
        'employment_status',
        'status',
        'join_date',
        'leave_quota',
        'avatar',
    ];

    protected $casts = [
        'join_date' => 'date:Y-m-d',
        'leave_quota' => 'integer',
    ];

    protected $appends = [
        'role',
        'location',
        'group',
        'scheduleCategory',
        'checkInTime',
        'checkOutTime',
    ];

    public function getRoleAttribute(): string
    {
        return $this->role_title ?? '';
    }

    public function getLocationAttribute(): string
    {
        return $this->location?->name ?? 'Lokasi Mariuk';
    }

    public function getGroupAttribute(): string
    {
        return $this->shift_group ?? 'Grup A';
    }

    public function getScheduleCategoryAttribute(): string
    {
        return $this->shift?->name ?? 'Shift Pagi (12 Jam)';
    }

    public function getCheckInTimeAttribute(): string
    {
        return $this->shift?->start_time ?? '07:00';
    }

    public function getCheckOutTimeAttribute(): string
    {
        return $this->shift?->end_time ?? '19:00';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(ShiftSchedule::class);
    }

    public function requestedSwaps(): HasMany
    {
        return $this->hasMany(ShiftSwap::class, 'requester_id');
    }

    public function targetSwaps(): HasMany
    {
        return $this->hasMany(ShiftSwap::class, 'target_employee_id');
    }
}
