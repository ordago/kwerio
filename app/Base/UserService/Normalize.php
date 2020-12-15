<?php

namespace Kwerio\UserService;

use App\Models\User as UserModel;

trait Normalize {
    /**
     * Normalize the returned list of users.
     *
     * @param LengthAwarePaginator|Collection $users
     * @return array
     */
    function normalize($users) {
        $items = $users->map(function($user) {
            $groups = $user->groups->pluck("uuid")->toArray();
            return array_merge(
                ["groups" => $groups],
                $user->only([
                    "uuid",
                    "type",
                    "payload",
                    "email",
                    "first_name",
                    "last_name",
                    "locale",
                    "timezone",
                    "locale_iso_format",
                    "created_at",
                    "updated_at",
                ])
            );
        });

        $page = request()->get("page");
        $total = 0;

        if (method_exists($users, "total")) {
            $total = $users->total();
        } else {
            $total = UserModel::count();
        }

        return [
            "items" => $items,
            "total" => $total,
            "next_page" => $total === config("app.per_page") ? $page + 1 : $page,
        ];
    }
}
