<?php declare(strict_types=1);

namespace App\Repositories;

use App\Opt\PaginatedTable;
use App\Models\User as UserModel;

class User {
    /**
     * Initialize constructor.
     *
     * @param PaginatedTable $paginatedTable
     */
    function __construct(PaginatedTable $paginatedTable) {
        $this->paginatedTable = $paginatedTable;
        $this->paginatedTable->setBuilder(UserModel::query());
    }

    /**
     * List users.
     *
     * @return array
     */
    function index() {
        return $this->paginatedTable->index();
    }
}
