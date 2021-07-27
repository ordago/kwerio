# Installation

## Development

```
$ cp .env.example .env
$ make
$ make exec
$ php artisan migrate --path database/migrations/system --database system
$ php artisan migrate --database system
$ php artisan db:seed --database system
```

### Create a tenant

- Insert a new row in `_system.tenants` with the tenant connection configuration.
- Create tenant database for testing.
- Migrate

```
$ php artisan tenant:migrate euvoor -m Home,Login -s
```

After the migration finished, visit `https://euvoor.kwerio.test`. use the
login credentials defined in `.env` file `ROOT_USER_EMAIL` and `ROOT_USER_PASSWORD`
to login as an owner.
