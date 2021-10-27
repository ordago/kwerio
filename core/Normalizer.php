<?php

namespace Kwerio;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Closure;

class Normalizer {
    private $message;
    private $message_variant = "success";
    private $meta = [];

    /**
     * Set response message.
     *
     * @return array
     */
    function message($message) {
        $this->message = $message;

        return $this;
    }

    /**
     * Return back a status that something failed to validate.
     */
    function failed($message) {
        return $this->error($message, 422);
    }

    /**
     * Return back a success status.
     */
    function success($message) {
        return response()->json([
            "message" => $message,
            "error" => false,
            "variant" => "success",
            "meta" => $this->meta,
        ], 200);
    }

    /**
     * Return back an info.
     */
    function info($message) {
        return info()->json([
            "message" => $message,
            "error" => false,
            "variant" => "info",
            "meta" => $this->meta,
        ], 200);
    }

    /**
     * Return back a warning response.
     */
    function warning($message) {
        return info()->json([
            "message" => $message,
            "error" => false,
            "variant" => "warning",
            "meta" => $this->meta,
        ], 200);
    }

    /**
     * Normalize error message.
     *
     * @param string  $message
     * @param integer $status
     * @return array
     */
    function error($message, $status = 500) {
        return response()->json([
            "message" => $message,
            "error" => true,
            "variant" => "error",
            "meta" => $this->meta,
        ], $status);
    }

    /**
     * Append metadata to the response.
     *
     * @return self
     */
    function meta($meta) {
        $this->meta = $meta;

        return $this;
    }

    /**
     * Normalize the given data to a paginated data.
     *
     * @param mixed $items
     * @param Closure $mapCallback
     * @param integer $total
     * @return array
     */
    function normalize($items, $mapCallback = null, $total = null) {
        $paginator = $this->_parse($items, $total);
        $items = $paginator->map(function($item) use($mapCallback) {
            if (!$mapCallback) {
                return $item;
            }

            if (is_array($mapCallback)) {
                return call_user_func_array($mapCallback, [$item]);
            }

            return $mapCallback($item);
        });

        $response = [
            "items" => $items,
            "current_page" => $paginator->currentPage(),
            "next_page" => $this->_get_next_page($paginator),
            "last_page" => $this->_get_last_page($paginator),
            "total" => $paginator->total(),
            "meta" => $this->meta,
        ];

        if ($this->message) {
            $response["message"] = $this->message;
            $response["variant"] = $this->message_variant;
        }

        return $response;
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

        if (is_array($items)) {
            $items = new Collection($items);
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
        if ($item && $item instanceof Model) {
            $class = get_class($item);
            $model = new $class;

            return $model->count();
        }

        return 0;
    }

    /**
     * Get currently requested page.
     *
     * @return integer
     */
    private function _get_current_page() {
        return request()->has("page") ? request()->get("page") : 1;
    }
}
