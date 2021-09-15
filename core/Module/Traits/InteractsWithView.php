<?php

namespace Kwerio\Module\Traits;

trait InteractsWithView {
    /**
     * Get module view name.
     *
     * @return View
     */
    function view(string $view, ...$params) {
        return view($this->uid . "::{$view}", ...$params);
    }
}
