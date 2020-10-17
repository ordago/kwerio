<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
    use HasFactory, Notifiable, Traits\LocalizeDatetimeAttributes;

    protected $guarded = [ ];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $with = ["groups"];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
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
     * Check if authenticated user is the owner of the application.
     *
     * @return bool
     */
    function is_owner(): bool {
        return !is_null($this->owner_at) && !empty(trim($this->owner_at));
    }

    function can_access_module($uid) {
        foreach ($this->groups as $group) {
            foreach ($group->modules as $module) {
                if ($module->uid === $uid) {
                    return true;
                }
            }
        }

        return true;
    }

    /**
     * Get user groups.
     *
     * @return BelongsToMany
     */
    function groups() {
        return $this->belongsToMany(Group::class);
    }
}
