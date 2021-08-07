<?php

namespace Kwerio\Metadata;

trait InteractsWithUser {
    /**
     * Set user information.
     *
     * @return array
     */
    function user() {
        $user = request()->user();

        $this->attributes["user"] = [
            "uuid" => $user->uuid,
            "owner_at" => $user->owner_at,
            "email" => $user->email,
            "first_name" => $user->first_name ?? "",
            "last_name" => $user->last_name ?? "",
            "locale" => $user->locale,
            "timezone" => $user->timezone,
            "locale_iso_format" => $user->locale_iso_format,
            "is_rtl" => (bool) $user->is_rtl,
            "dir" => $user->is_rtl ? "rtl" : "ltr",
            "groups" => $user->get_groups_uuids(),
            "is_root" => $user->is_root(),
            "groups_meta" => $user->groups()->get(["uuid", "name", "slug"]),
            "modules_meta" => $user->modules()->map(fn($item) => [ "uid" => $item->uid, "uuid" => $item->uuid ]),
            "modules" => $user->get_modules_uuids(),
            "abilities" => $user->get_abilities_names(),
        ];

        return $this;
    }
}
