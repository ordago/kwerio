<?php declare(strict_types=1);

namespace App\Repositories;

use App\Base\Table\Paginated as PaginatedTable;
use App\Models\Group as GroupModel;

class Group {
    /**
     * Initialize constructor.
     *
     * @param PaginatedTable $paginatedTable
     */
    function __construct(PaginatedTable $paginatedTable) {
        $this->paginatedTable = $paginatedTable;
        $this->paginatedTable->setBuilder(GroupModel::query());
    }

    /**
     * List groups.
     *
     * @return array
     */
    function index() {
        return $this->paginatedTable->index();
    }
}
