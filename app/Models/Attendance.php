<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'check_in_time',
        'check_out_time',
        'status',
        'late_minutes',
        'early_departure_minutes',
        'work_duration_hours',
        'location_id',
        'latitude_in',
        'longitude_in',
        'latitude_out',
        'longitude_out',
        'photo_in',
        'photo_out',
        'method',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'late_minutes' => 'integer',
            'early_departure_minutes' => 'integer',
            'work_duration_hours' => 'float',
            'latitude_in' => 'float',
            'longitude_in' => 'float',
            'latitude_out' => 'float',
            'longitude_out' => 'float',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }
}
