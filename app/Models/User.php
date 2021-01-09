<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;
use Kwerio\AuthUser as Authenticatable;

class User extends Authenticatable {
    use HasFactory,
        Notifiable,
        Traits\LocalizeDatetimeAttributes,
        Traits\InteractsWithGroup,
        Traits\InteractsWithModule,
        Traits\InteractsWithAbility,
        Traits\Authorizable;

    protected $guarded = [];

    protected $casts = [
        "email_verified_at" => "datetime",
    ];

    public static function boot() {
        parent::boot();

        self::creating(function($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid();
            }
        });
    }
}
