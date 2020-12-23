<?php

namespace App\Http\Controllers\Account\Permissions;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Models\{
    AccessToken,
};

class AccessTokenController extends Controller {
    private $carry_token = false;
    private $token = null;

    /**
     * Show access tokens page.
     *
     * @return View
     */
    function show_index_page() {
        return view("account.permissions.access-tokens");
    }

    /**
     * Show create access tokens page.
     *
     * @return View
     */
    function show_create_page() {
        return view("account.permissions.access-tokens");
    }

    /**
     * Show update access tokens page.
     *
     * @return View
     */
    function show_update_page() {
        return view("account.permissions.access-tokens");
    }

    /**
     * Get tokens.
     *
     * @return array
     */
    function index(Request $request) {
        $data = $request->validate([
            "page" => "required|numeric",
            "sorts" => "array",
            "q" => "nullable",
        ]);

        $query = AccessToken::query();

        if (!empty($data["q"])) {
            $query->where("name", "like", "%{$data['q']}%")
                ->orWhere("token", "like", "%{$data['q']}%");
        }

        foreach ($data["sorts"] as $sort) {
            if (in_array($sort["name"], ["email"])) {
                $query->with(["user" => function($query) use($sort) {
                    $query->orderBy($sort["name"], $sort["dir"]);
                }]);
            } else {
                $query->orderBy($sort["name"], $sort["dir"]);
            }
        }

        $items = $query->paginate(config("app.per_page"));

        return $this->_normalize($items);
    }

    /**
     * Create new access token.
     *
     * @param Request $request
     * @return array
     */
    function create(Request $request) {
        $data = $request->validate([
            "uuid" => "nullable",
            "name" => "nullable",
            "is_hashed" => "required|boolean",
            "expired_at" => "nullable",
        ]);

        $this->carry_token = true;

        return $this->_upsert($data);
    }

    /**
     * Update existing access token.
     *
     * @param Request $request
     * @return array
     */
    function update(Request $request) {
        $data = $request->validate([
            "uuid" => "required|exists:access_tokens,uuid",
            "name" => "nullable",
            "is_hashed" => "required|boolean",
            "expired_at" => "nullable",
            "original_token" => "nullable",
        ]);

        return $this->_upsert($data);
    }

    /**
     * Create or update an access token.
     *
     * @param string|null $uuid
     * @return array
     */
    private function _upsert($data) {
        $token = $this->token = Str::random(48);

        if (!empty($data["original_token"])) {
            $this->carry_token = true;
            $this->token = $data["original_token"];
        }

        if ($data["is_hashed"]) {
            $token = hash("sha256", $token);
        }

        if (!empty($data["uuid"])) {
            $item = AccessToken::whereUuid($data["uuid"])->firstOrFail();
            $token = $item->token;

            if ($data["is_hashed"] && !$item->is_hashed) {
                $token = hash("sha256", $item->token);
            }
        }

        if (!empty($data["expired_at"])) {
            $expired_at = strtotime("+ " . $data["expired_at"]);

            if ($expired_at) {
                $data["expired_at"] = Carbon::createFromTimestamp($expired_at);
            }
        }

        $accessToken = AccessToken::updateOrCreate(["uuid" => $data["uuid"]], [
            "user_id" => Auth::id(),
            "is_hashed" => $data["is_hashed"],
            "name" => $data["name"],
            "expired_at" => $data["expired_at"],
            "token" => $token,
        ]);

        return $this->_normalize(
            $accessToken->whereUuid($accessToken->uuid)->get()
        );
    }

    function fetch_by_uuid(Request $request) {
        $data = $request->validate([
            "uuid" => "required|exists:access_tokens,uuid",
        ]);

        return $this->_normalize(
            AccessToken::whereUuid($data["uuid"])->get()
        );
    }

    /**
     * Normalize access token data.
     *
     * @param LengthAwarePaginator|Collect $accessTokens
     * @return array
     */
    private function _normalize($accessTokens) {
        $items = $accessTokens->map(function($accessToken) {
            return [
                "uuid" => $accessToken->uuid,
                "name" => $accessToken->name,
                "is_hashed" => (bool) $accessToken->is_hashed,
                "token" => $accessToken->token,
                "original_token" => $this->carry_token ? $this->token : null,
                "email" => $accessToken->user->email,
                "created_at" => $accessToken->created_at,
                "updated_at" => $accessToken->udpated_at,
                "expired_at" => $accessToken->expired_at,
            ];
        });

        if (method_exists($accessTokens, "total")) {
            $total = $accessTokens->total();
        } else {
            $total = AccessToken::count();
        }

        $page = request()->get("page") ?? 1;

        return [
            "items" => $items,
            "total" => $total,
            "next_page" => $total === config("app.per_page") ? $page + 1 : $page,
        ];
    }
}