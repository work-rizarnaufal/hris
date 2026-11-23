<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function seed($class = 'Database\\Seeders\\DatabaseSeeder')
    {
        parent::seed($class);

        $admin = User::where('role', 'super_admin')->first() ?? User::first();
        if ($admin) {
            $this->actingAs($admin);
        }

        return $this;
    }
}
