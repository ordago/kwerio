<?php declare(strict_types=1);

namespace App\Repositories;

use App\Base\Table\Paginated as PaginatedTable;
use App\Models\Module as ModuleModel;
use SplFileInfo;

class Module {
    /**
     * Initialize constructor.
     *
     * @param PaginatedTable $paginatedTable
     */
    function __construct(PaginatedTable $paginatedTable) {
        $this->paginatedTable = $paginatedTable;
        $this->paginatedTable->setBuilder(ModuleModel::query());
    }

    /**
     * List Modules.
     *
     * @return array
     */
    function index() {
        return $this->paginatedTable->index();
    }

    /**
     * Get a list of all available modules.
     *
     * @return array
     */
    function all() {
        return ModuleModel::all();
    }
}
