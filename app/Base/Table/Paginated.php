<?php declare(strict_types=1);

namespace App\Base\Table;

use Illuminate\Database\Eloquent\Builder;

class Paginated {
    private $builder;

    function setBuilder(Builder $builder) {
        $this->builder = $builder;
    }

    function index() {
        $data = request()->only("page", "per_page", "q", "sorts");

        return $this->builder
            ->orderBy("updated_at", "desc")
            ->paginate($data["per_page"], [
                "id",
                "uuid",
                "email",
                "first_name",
                "last_name",
                "created_at",
                "updated_at",
            ]);
    }
}
