<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Group extends Model {
    use HasFactory,
        Traits\LocalizeDatetimeAttributes,
        Traits\InteractsWithAbility;

    protected $guarded = [];
    protected $hidden = ["pivot"];

    public static function boot() {
        parent::boot();

        static::creating(function($model) {
            if (!$model->uuid) {
                $model->uuid = Str::uuid();
            }
        });
    }

    /**
     * Get group modules.
     *
     * @return BelongsToMany
     */
    function modules() {
        return $this->belongsToMany(Module::class)
            ->withTimestamps();
    }

    /**
     * Get all groups normalized.
     *
     * @return array
     */
    static function all_normalized() {
        $groups = Group::get()->map(function($group) {
            $modules = $group->modules->pluck("uuid")->toArray();
            $abilities = $group->abilities->pluck("uuid")->toArray();

            return array_merge(
                compact("modules", "abilities"),
                [
                    "uuid" => $group->uuid,
                    "name" => $group->name,
                    "created_at" => $group->created_at,
                    "updated_at" => $group->updated_at,
                ]
            );
        });

        return [
            "items" => $groups,
            "total" => Group::count(),
        ];
    }
}
