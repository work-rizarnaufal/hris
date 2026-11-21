<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftSwap extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_id',
        'target_employee_id',
        'date_swap',
        'target_date_swap',
        'status',
        'approved_by',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'date_swap' => 'date',
            'target_date_swap' => 'date',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'requester_id');
    }

    public function targetEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'target_employee_id');
    }

    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
