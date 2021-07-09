<?php

namespace Kwerio\Module;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Fluent;

class MenuBuilder extends Fluent {
    /**
     * Build the menu.
     */
    function __construct($items = []) {
        $user = Auth::user();
        $module = resolve("module");

        foreach ($items as $title => $content) {
            if (!$this->_can($content)) continue;

            $content["slug"] = $content["slug"] ?? Str::slug($title);
            $children = [];

            foreach ($content["children"] ?? [] as $sub_title => $sub_content) {
                if ($this->_can($sub_content)) {
                    $sub_content['slug'] = $sub_content["slug"] ?? Str::slug($sub_title);
                    $sub_content["link"] = $sub_content["link"] ?? $module->route("/{$content['slug']}/{$sub_content['slug']}");
                    $children[] = $this->_compile($sub_title, $sub_content);
                }
            }

            $content["children"] = $children;
            $content["open"] = $content["open"] ?? true;

            $this->attributes[] = $this->_compile($title, $content);
        }
    }

    /**
     * Append item to the given array.
     */
    function _compile($title, $from) {
        $item["id"] = $from["id"] ?? Str::uuid();
        $item["text"] = $title;
        $item["slug"] = $item["slug"] ?? Str::slug($title);
        $item["link"] = $from["link"] ?? null;
        $item["icon"] = $from["icon"] ?? null;
        $item["open"] = $from["open"] ?? true;
        $item["children"] = $from["children"] ?? null;

        $item["matches"] = $from["matches"] ?? ($item['link']
            ? [ $item['link'], "{$item['link']}/create", "{$item['link']}/update/:uuid" ]
            : null
        );

        return array_filter($item, fn($value) => ! is_null($value));
    }

    /**
     * Check if menu can be added.
     */
    function _can($content): bool {
        $user = Auth::user();

        if (isset($content["if"])) return $user->can($content["if"]);
        if (isset($content["if_any"])) return $user->canAny($content["if_any"]);

        return true;
    }
}
