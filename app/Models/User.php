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
        Traits\InteractsWithGroup;

    protected $guarded = [];
    protected $with = ["groups"];

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

    function abilities() {
        return $this->belongsToMany(Ability::class);
    }

    /**
     * Check if user is allowed to access module.
     *
     * @param string $uid
     */
    function can_access_module($uid) {
        foreach ($this->groups as $group) {
            foreach ($group->modules as $module) {
                if ($module->uid === $uid) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get ids of the modules that this user has access to.
     *
     * @return array
     */
    function get_modules_ids() {
        $ids = [];

        foreach ($this->groups as $group) {
            foreach ($group->modules as $module) {
                $ids[] = $module->uid;
            }
        }

        return $ids;
    }
}
