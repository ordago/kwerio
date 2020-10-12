<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model {
    use Traits\LocalizeDatetimeAttributes;

    protected $guarded = [];
}
