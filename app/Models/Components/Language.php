<?php

namespace App\Models\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits;

class Language extends Model {
    use HasFactory, Traits\LocalizeDatetimeAttributes;

    protected $guarded = [];

    public static function boot() {
        parent::boot();

        static::creating(function($model) {
            if (!$model->uuid) {
                $model->uuid = Str::uuid();
            }
        });
    }
}
