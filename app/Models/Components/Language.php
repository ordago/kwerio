<?php

namespace App\Models\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Tenant\Traits;

class Language extends Model {
    use HasFactory,
        Traits\LocalizeDatetimeAttributes,
        Traits\UserActionLogger;

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
