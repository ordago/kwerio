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
            $content["link"] = $this->_link($content);
            $children = [];

            foreach ($content["children"] ?? [] as $sub_title => $sub_content) {
                if ($this->_can($sub_content)) {
                    $sub_content["slug"] = $sub_content["slug"] ?? Str::slug($sub_title);
                    $sub_content["link"] = $this->_link($sub_content, $content["link"]);
                    $children[] = $this->_compile($sub_title, $sub_content);
                }
            }

            $content["children"] = $children;
            $content["open"] = $content["open"] ?? true;

            $this->attributes[] = $this->_compile($title, $content);
        }
    }

    /**
     * Build menu link.
     */
    private function _link($content, $prefix = "") {
        $prefix = fn($link) => "/" . trim("{$prefix}/{$link}", "/");

        if (isset($content["link"])) {
            return  $prefix($content["link"]);
        }

        if (isset($content["slug"])) {
            return $prefix($content["slug"]);
        }

        return $prefix;
    }

    /**
     * Append item to the given array.
     */
    private function _compile($title, $from) {
        $item["id"] = $from["id"] ?? Str::uuid();
        $item["text"] = $title;
        $item["slug"] = $item["slug"] ?? Str::slug($title);
        $item["link"] = $from["link"] ?? null;
        $item["icon"] = $from["icon"] ?? null;
        $item["open"] = $from["open"] ?? true;
        $item["children"] = $from["children"] ?? [];

        $item["matches"] = $from["matches"] ?? (
            $item["link"]
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
