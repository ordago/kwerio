<?php

namespace Kwerio;

use Illuminate\Http\Request;
use Kwerio\Normalizer;
use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\Access\Gate;

class PaginatedTableDataProvider {
    private $query;
    private $data;

    /**
     * Initialize Constructor.
     */
    function __construct(
        private Request $request,
        private Normalizer $normalizer,
    ) {
        $this->data = $request->validate([
            "page" => "required|numeric",
            "sorts" => "nullable|array",
            "q" => "nullable",
        ]);
    }

    /**
     * Set the query that will be used to fetch data.
     *
     * @return self
     */
    function query($query) {
        $this->query = $query;

        return $this;
    }

    /**
     * Authorize given abilities.
     *
     * @param string|array $abilities
     * @return self
     * @throws Exception
     */
    function authorize($abilities) {
        $abilities = is_array($abilities) ? $abilities : func_get_args();
        $module_uid = config("module");

        foreach ($abilities as $ability) {
            if (!is_null($module_uid) && strpos($ability, "/") === false) {
                $ability = "{$module_uid}/{$ability}";
            }

            app(Gate::class)->authorize($ability);
        }

        return $this;
    }

    /**
     * Apply a basic filter on the query.
     *
     * @param string|array $filters
     * @return self
     */
    function basic_filter($filters) {
        $filters = is_array($filters) ? $filters : func_get_args();

        if (!empty($this->data["q"])) {
            $where = "where";

            foreach ($filters as $filter) {
                $this->query->{$where}($filter, "like", "%{$this->data['q']}%");
                $where = "orWhere";
            }
        }

        return $this;
    }

    /**
     * Fetch and normalize the data.
     *
     * @param string|array|callback $callback
     * @return array
     */
    function normalize($callback) {
        $sorts = empty($this->data["sorts"]) ? [] : $this->data["sorts"];

        foreach ($sorts as $sort) {
            $this->query->orderBy($sort["name"], $sort["dir"] ?? "asc");
        }

        $items = $this->query->paginate(config("app.per_page"));

        if (is_string($callback) || is_array($callback)) {
            $fields = is_array($callback) ? $callback : func_get_args();
            $callback = function($item) use($fields) {
                return $item->only($fields);
            };
        }

        return $this->normalizer
            ->normalize($items, $callback);
    }
}
