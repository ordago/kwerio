<?php declare(strict_types=1);

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

        if ($total < $per_page) {
            $next_page = $page - 1;
        } else {
            $next_page = $page;
        }

        return [
            "total" => $total,
            "items" => $items,
            "next_page" = $next_page < 0 ? 0 : $next_page,
        ];
    }
}
