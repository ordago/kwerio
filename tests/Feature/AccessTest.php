<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Http;

class AccessTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $endpoint = "http://127.0.0.1/~test";
    private $api = "http://127.0.0.1/~test/api";

    /** @test */
    function web_no_auth() {
        $data = Http::get($this->endpoint)->json()["type"];
        $this->assertEquals($data, "web_no_auth");
    }

    /** @test */
    function web_auth() {
        $response = Http::withOptions(["allow_redirects" => false])
            ->get("{$this->endpoint}/protected");

        $this->assertEquals($response->status(), 302);
        $this->assertEquals($response->headers()["Location"], ["http://127.0.0.1/_/login"]);
    }

    /** @test */
    function webapi_from_web_no_auth() {
        $response = Http::get($this->api);
        $cookieJar = $response->cookies();
        $this->assertNotNull($cookieJar->getCookieByName("XSRF-TOKEN"));
        $this->assertNotNull($cookieJar->getCookieByName("kwerio_session"));
        $this->assertEquals($response->json(), ["type" => "webapi_no_auth"]);
    }

    /** @test */
    function webapi_from_web_auth() {
        $response = Http::withOptions(["allow_redirects" => false])
            ->get("{$this->api}/protected");

        $cookieJar = $response->cookies();
        $this->assertNotNull($cookieJar->getCookieByName("XSRF-TOKEN"));
        $this->assertNotNull($cookieJar->getCookieByName("kwerio_session"));
        $this->assertEquals($response->status(), 302);
        $this->assertEquals($response->headers()["Location"], ["http://127.0.0.1/_/login"]);
    }
}
