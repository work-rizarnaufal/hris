<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'day_name',
        'name',
        'category',
        'deducts_leave',
        'operational_note',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'deducts_leave' => 'boolean',
        ];
    }
}
