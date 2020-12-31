<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;

class User extends Authenticatable {
    use HasFactory,
        Notifiable,
        Traits\LocalizeDatetimeAttributes,
        Traits\InteractsWithGroup,
        Traits\InteractsWithModule,
        Traits\InteractsWithAbility;

    protected $guarded = [];
    protected $with = ["groups", "abilities"];

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

    /**
     * Get user abilities.
     *
     * @return BelongsToMany
     */
    function abilities() {
        return $this->belongsToMany(Ability::class);
    }
}
