#!/usr/bin/env bash
set -eo pipefail

rm -rf dist

astro build 2>&1 | grep -Ev $'  [├└]─'

pagefind --site dist
