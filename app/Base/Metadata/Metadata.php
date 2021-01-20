<?php

namespace Kwerio\Metadata;

use Illuminate\Support\Fluent;

class Metadata extends Fluent {
    use InteractsWithModule,
        InteractsWithUser,
        InteractsWithMenu;
}
