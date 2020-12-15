<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;

class User extends Authenticatable {
    use HasFactory, Notifiable, Traits\LocalizeDatetimeAttributes;

    protected $guarded = [ ];
    protected $with = ["groups"];

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

    /**
     * Check if user is allowed to access module.
     *
     * @param string $uid
     */
    function can_access_module($uid) {
        if ($this->is_owner()) {
            return true;
        }

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
     * Get user groups.
     *
     * @return BelongsToMany
     */
    function groups() {
        return $this->belongsToMany(Group::class);
    }

    /**
     * Is user member of eather of the given groups.
     *
     * @param string|array $groups
     * @return bool
     */
    function member_of_eather_groups($groups) {
        $groups = Arr::wrap($groups);

        foreach ($this->groups->pluck("name") as $name) {
            foreach ($groups as $group) {
                if ($group === $name) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Is user member of the given group.
     *
     * @param string $group
     * @return bool
     */
    function member_of_group($group) {
        return $this->member_of_eather_groups($group);
    }


    /**
     * Get ids of the groups that this user belongs to.
     *
     * @return array
     */
    function get_groups_ids() {
        return $this->groups->pluck("uuid");
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
