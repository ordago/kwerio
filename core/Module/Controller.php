<?php

namespace Kwerio\Module;

use App\Http\Controllers\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\{
    Arr,
    Str,
};

class Controller extends BaseController {
    /**
     * Parse ability.
     *
     * @param string $ability
     * @return string
     */
    private function _parse_ability($ability) {
        $module = resolve("module");

        if (empty($module)) {
            throw new \Exception("Current module in use, is not set.");
        }

        if (Str::startsWith($ability, "{$module->uid}/")) {
            return $ability;
        }

        return "{$module->uid}/{$ability}";
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

    /**
     * Authorize if any of the given abilities is allowed.
     *
     * @param string|array $abilities
     * @param array        $arguments
     * @return boolean
     */
    function authorizeAny($abilities, $arguments = []) {
        $user = Auth::user();
        $abilities = Arr::wrap($abilities);

        foreach ($abilities as $ability) {
            if ($user->can($ability)) {
                return true;
            }
        }

        return $this->authorize($abilities[0], $arguments);
    }
}
