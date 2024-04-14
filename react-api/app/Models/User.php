<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Import HasApiTokens trait

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens; // Add HasApiTokens trait

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', // Assuming 'userName' is your desired username field
        'email',
        'password',
    ];

    public function todos(){
        return $this.hasOne(TodoList::class);
    }

    public function notes(){
        return $this.hasMany(Notes::class);
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
