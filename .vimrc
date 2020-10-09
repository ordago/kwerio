autocmd FileType php nmap <leader>r :!clear && docker exec -u `id -u` -t kwerio php artisan test --filter %:t:r\:\:<C-r>=cfi#format('%s', '')<cr><cr>
autocmd FileType php nmap <leader>tc :!clear && docker exec -u `id -u` -t kwerio php artisan test --filter %:t:r<cr>
autocmd FileType php nmap <leader>tt :!clear && docker exec -u `id -u` -t kwerio php artisan test

nmap <leader>e :!clear && docker exec -it -u `id -u` -w /var/www/html kwerio bash<cr><cr>

if !exists('g:vdebug_options')
    let g:vdebug_options = {}
endif

let g:vdebug_options.path_maps = {
    \ '/var/www/html': getcwd()
    \ }

let g:vdebug_options.break_on_open = 0
let g:vdebug_options.ide_key = "kwerio"
