<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Module extends Model {
    use HasFactory, Traits\LocalizeDatetimeAttributes;

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
     * Get module abilities.
     *
     * @return HasMany
     */
    function abilities() {
        return $this->hasMany(Ability::class);
    }

    /**
     * Get all modules normalized.
     *
     * @return array
     */
    static function all_normalized() {
        $modules = config("modules");

        $items = Module::get(["id", "uid", "uuid", "created_at", "updated_at"])
            ->map(function($item) use($modules) {
                $module = array_values(array_filter($modules, function($inner) use($item) {
                    return $inner["uid"] === $item->uid;
                }))[0];

                return [
                    "uid" => $item->uid,
                    "uuid" => $item->uuid,
                    "name" => $module["name"],
                    "abilities" => $item->abilities()->pluck("uuid"),
                    "created_at" => $item->created_at,
                    "updated_at" => $item->updated_at,
                ];
            });

        return [
            "items" => $items,
            "total" => Module::count(),
        ];
    }
}
