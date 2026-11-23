<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        User::create([
            'name' => 'Nabiel',
            'email' => 'nabiel@hrd.com',
            'password' => Hash::make('nabiel123'),
            'role' => 'super_admin',
            'nip' => 'HC-0001',
            'is_active' => true,
        ]);
    }

    public function test_unauthenticated_user_is_redirected_to_login_when_accessing_admin_routes(): void
    {
        $response = $this->get('/beranda');
        $response->assertRedirect('/login');

        $responseKaryawan = $this->get('/karyawan');
        $responseKaryawan->assertRedirect('/login');
    }

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen_with_email(): void
    {
        $response = $this->post('/login', [
            'email' => 'nabiel@hrd.com',
            'password' => 'nabiel123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/beranda');
    }

    public function test_users_can_authenticate_using_nip(): void
    {
        $response = $this->post('/login', [
            'email' => 'HC-0001',
            'password' => 'nabiel123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/beranda');
    }

    public function test_users_cannot_authenticate_with_invalid_password(): void
    {
        $response = $this->from('/login')->post('/login', [
            'email' => 'nabiel@hrd.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('email');
    }

    public function test_authenticated_user_is_redirected_away_from_login(): void
    {
        $user = User::first();

        $response = $this->actingAs($user)->get('/login');
        $response->assertRedirect('/beranda');
    }

    public function test_users_can_logout(): void
    {
        $user = User::first();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/login');
    }
}
