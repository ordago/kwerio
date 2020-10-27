<?php declare(strict_types=1);

namespace App\Base;

class Table {
    /**
     * Prepare a table response.
     *
     * @param array|Collection $items
     * @param integer          $total
     * @return array
     */
    function response($items, $total) {
        $page = request()->get("page");
        $per_page = config("app.per_page");
        $last_page = max((int) ceil($total / $per_page), 1);

        return [
            "total" => $total,
            "items" => $items,
            "next_page" => $page > $last_page ? $last_page : $page,
        ];
    }
}
