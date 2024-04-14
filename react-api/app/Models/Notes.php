<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notes extends Model
{
    protected $fillable = ['body', 'color', 'user_id'];
    
    use HasFactory;

    public function user() {
        return this->belongsTo(Users::class);
    }
}
