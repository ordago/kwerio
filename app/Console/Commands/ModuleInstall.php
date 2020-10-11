<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Repositories\Module as ModuleRepository;

class ModuleInstall extends Command
{
    /**
     * @var ModuleRepository
     */
    private $moduleRepo;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = '
        module:install
            {-p=|--path= : Local path to module}
    ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install new module';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(ModuleRepository $moduleRepo)
    {
        parent::__construct();
        $this->moduleRepo = $moduleRepo;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $path = $this->option("path");

        $this->moduleRepo->install_from_local_path($path);

        return 0;
    }
}
