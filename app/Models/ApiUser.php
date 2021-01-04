<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ApiUser extends Model {
    use HasFactory,
        Traits\LocalizeDatetimeAttributes,
        Traits\InteractsWithGroup,
        Traits\InteractsWithAbility;

    protected $guarded = [];
    protected $with = ["user"];

    public static function boot() {
        parent::boot();

        static::creating(function($model) {
            if (!$model->uuid) {
                $model->uuid = Str::uuid();
            }
        });
    }

    function user() {
        return $this->belongsTo(User::class);
    }
}
