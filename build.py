#! /usr/bin/env python3

from os import system

# compile and transpile static files
system('python3 manage.py collectstatic')

# minify resulting css files
system('oenv/bin/css-html-js-minify static/css/')

# minify resulting javascript files
system('oenv/bin/css-html-js-minify static/js/app.js')
system('oenv/bin/css-html-js-minify static/js/utils.js')
print('\nMake sure the minified files are linked in base.html!')