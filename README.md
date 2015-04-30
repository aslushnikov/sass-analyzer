# Analyze set of SCSS files.

## How-to

1. Install dependencies via `npm install`
2. Put your set of scss files in `./scss` folder
3. Run `./search.sh lighten` to grep files for lighten color function. Run `./search.sh lighten darken` to grep for matches of lighten OR darken functions.
4. Run `node analyze.js scss/` to get stats regarding properties using SASS Script (refered as "complex" properties)
