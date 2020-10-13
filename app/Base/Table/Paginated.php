<?php declare(strict_types=1);

namespace App\Base\Table;

use Illuminate\Database\Eloquent\Builder;

class Paginated {
    private $builder;

    function setBuilder(Builder $builder) {
        $this->builder = $builder;
    }

    /**
     * List items.
     *
     * @param ...$columns
     * @return LengthAwarePaginator
     */
    function index($columns = ['*']) {
        $data = request()->only("page", "per_page", "q", "sorts");

        return $this->builder->paginate(
            $data["per_page"],
            is_array($columns) ? $columns : func_get_args()
        );
    }
}
