<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Module extends Model {
    use Traits\LocalizeDatetimeAttributes;

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
}
