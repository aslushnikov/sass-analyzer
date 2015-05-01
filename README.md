# Gather statistics for SCSS files.

The script gathers the following statistics about SCSS files:
- Total amount of properties defined
- Amount of properties with a plain CSS value
- Amount of properties with a plain CSS value and a single SCSS var usage (without any SASS script)
- Amount of properties with SASS script

## Installing

1. `git clone https://github.com/aslushnikov/sass-analyzer`
2. `cd sass-analyzer && npm install`

## Gathering stats

1. `node analyze.js directory-with-scss-to-analyze/`

## Running tests

1. `mocha test`
