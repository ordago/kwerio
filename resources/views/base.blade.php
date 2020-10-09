<!DOCTYPE html>
<html
  dir="{{ isset($dir) ? $dir : 'ltr' }}"
  lang="{{ isset($lang) ? $lang : 'en' }}"
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" type="image/x-icon" href="" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

        @stack('styles')
    </head>

    <body>
        <div id="root"></div>

        @stack('scripts')
    </body>

</html>
