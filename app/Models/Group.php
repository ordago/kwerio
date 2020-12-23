<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Group extends Model {
    use HasFactory, Traits\LocalizeDatetimeAttributes;

    protected $guarded = [];
    protected $hidden = ["pivot"];
    protected $with = ["modules"];

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
        return $this->belongsToMany(Module::class);
    }

    /**
     * Get group abilities.
     *
     * @return Collection
     */
    function abilities() {
        $abilities = new Collection;

        $append = function($prefix) use($abilities) {
            Ability::where("name", "like", "{$prefix}/%")
                ->get()
                ->each(function($ability) use($abilities) {
                    $abilities->push($ability);
                });
        };

        if ($this->name === "root") {
            $append("root");
        } else {
            $this->modules->each(function($module) use($append) {
                $append($module->uid);
            });
        }

        return $abilities;
    }
}
