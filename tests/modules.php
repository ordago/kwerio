<?php declare(strict_types=1);

use Symfony\Component\Finder\Finder;

$finder = new Finder;
$finder
    ->files()
    ->in(__DIR__ . '/../modules/*/tests')
    ->name("/Test\.php$/");

foreach ($finder as $file) {
    require_once $file->getPathname();
}
