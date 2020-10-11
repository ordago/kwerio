<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Base\Module\Maker;

class ModuleSync extends Command
{
    protected $signature = "module:sync";

    protected $description = "Add modules that do not exist in database to database";

    function handle() {
        resolve(Maker::class)->sync();
    }
}
