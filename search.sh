#!/bin/bash
set -e
searchString=""
query=""
for var in "$@"; do
    searchString="$searchString\|\b$var("
    query="$query OR $var"
done;

searchString=${searchString#'\|'}
query=${query#' OR '}

number=$(grep -l -i "$searchString" scss/* | wc -l)
echo $query: $number
