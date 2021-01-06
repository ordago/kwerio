<?php

namespace Kwerio;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Closure;

class Normalizer {
    /**
     * Normalize the given data to a paginated data.
     *
     * @param mixed $items
     * @param Closure $mapCallback
     * @param integer $total
     * @return array
     */
    function normalize($items, $mapCallback, $total = null) {
        $paginator = $this->_parse($items, $total);
        $items = $paginator->map(function($item) use($mapCallback) {
            if (is_array($mapCallback)) {
                return call_user_func_array($mapCallback, [$item]);
            }

            return $mapCallback($item);
        });

        return [
            "items" => $items,
            "current_page" => $paginator->currentPage(),
            "next_page" => $this->_get_next_page($paginator),
            "last_page" => $this->_get_last_page($paginator),
            "total" => $paginator->total(),
        ];
    }

    /**
     * Get last page.
     *
     * @param LengthAwarePaginator $paginator
     * @return integer
     */
    private function _get_last_page(LengthAwarePaginator $paginator) {
        if ($paginator->count() < config("app.per_page")) {
            return $paginator->currentPage();
        }

        return $paginator->lastPage();
    }

    /**
     * Get next page.
     *
     * @param LengthAwarePaginator $pagintor
     * @return integer
     */
    private function _get_next_page(LengthAwarePaginator $paginator) {
        if ($paginator->count() < config("app.per_page")) {
            return $paginator->currentPage();
        }

        if ($paginator->hasMorePages()) {
            return $paginator->currentPage() + 1;
        }

        return $paginator->currentPage();
    }

    private function _parse($items, $total): LengthAwarePaginator {
        // Parse single model..
        if ($items instanceof Model) {
            if (is_null($total)) {
                $total = $this->_get_total_from_model($items);
            }

            $paginator = new LengthAwarePaginator([$items], $total, config("app.per_page"), $this->_get_current_page());

            return $paginator;
        }

        // Parse a collection of models..
        if ($items instanceof Collection) {
            if (is_null($total)) {
                $total = $this->_get_total_from_model($items->first());
            }

            $paginator = new LengthAwarePaginator($items, $total, config("app.per_page"), $this->_get_current_page());

            return $paginator;
        }

        // Parse a LengthAwarePagintor..
        if ($items instanceof LengthAwarePaginator) {
            return $items;
        }
    }

    /**
     * Get number of models available.
     *
     * @param Model $item
     * @return integer
     */
    private function _get_total_from_model($item) {
        $class = get_class($item);
        $model = new $class;
        return $model->count();
    }

    /**
     * Get currently requested page.
     *
     * @return integer
     */
    private function _get_current_page() {
        return request()->has("page") ? $request->get("page") : 1;
    }
}
