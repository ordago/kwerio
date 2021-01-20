<?php

namespace Kwerio\Module;

use App\Http\Controllers\Controller as BaseController;
use Illuminate\Support\Str;

class Controller extends BaseController {
    /**
     * Parse ability.
     *
     * @param string $ability
     * @return string
     */
    private function _parse_ability($ability) {
        $module = config("module");

        if (empty($module)) {
            throw new \Exception("Current module in use, is not set.");
        }

        if (Str::startsWith($ability, "{$module}/")) {
            return $ability;
        }

        return "{$module}/{$ability}";
    }

    /**
     * {@inheritdoc}
     */
    public function authorize($ability, $arguments = []) {
        return parent::authorize($this->_parse_ability($ability), $arguments);
    }

    /**
     * {@inheritdoc}
     */
    public function authorizeForUser($user, $ability, $arguments = []) {
        return parent::authorizeForUser($user, $this->_parse_ability($ability), $arguments);
    }
}
