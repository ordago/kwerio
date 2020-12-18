<?php

namespace App\Http\Controllers\Account\Permissions;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Models\{
    AccessToken,
};

class AccessTokenController extends Controller {
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
     * Create new access token.
     *
     * @param Request $request
     * @return array
     */
    function create(Request $request) {
        return $this->_upsert($request->get("uuid"));
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
        ]);

        return $this->_upsert($data["uuid"]);
    }

    /**
     * Create or update an access token.
     *
     * @param string|null $uuid
     * @return array
     */
    private function _upsert(?string $uuid) {
        $token = Str::random(48);

        $accessToken = AccessToken::updateOrCreate(["uuid" => $uuid], [
            "user_id" => Auth::id(),
            "token" => hash("sha256", $token),
        ]);

        return [
            "uuid" => $accessToken->uuid,
            "token" => $token,
        ];
    }
}
