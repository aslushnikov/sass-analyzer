var fs = require("fs")
  , ProgressBar = require("progress")
  , fileStats = require("./FileStats")
  , path = require("path")
  , program = require("commander")

program
    .version("0.1.0")
    .parse(process.argv);

var directory = program.args[0]
if (!directory) {
    console.error("Usage: node analyze.js <directory with .scss files>");
    return;
}

fs.readdir(directory, function(err, files) {
    if (err || !files) {
        console.error("Failed to read directory: " + directory);
        return;
    }

    // Total amount of complex properties and properties across all files.
    var totalCSSProperties = 0
      , totalProperties = 0
      , totalSASSVarProperties = 0
      , totalSASSScriptProperties = 0

    // Fancy UI.
    var bar = new ProgressBar(":bar", { total: files.length });
    console.log("Analyzing " + files.length + " files...");

    loop(0);
    function loop(index) {
        if (index < files.length)
            fileStats(path.join(directory, files[index]), onStats.bind(null, index));
        else
            outputStats();
    }

    function onStats(index, err, stats) {
        bar.tick();
        if (err)
            console.log(err);
        if (stats) {
            totalProperties += stats.properties;
            totalCSSProperties += stats.cssProperties;
            totalSASSVarProperties += stats.sassVarProps;
            totalSASSScriptProperties += stats.sassScriptProps;
        }
        loop(index + 1);
    }

    function outputStats() {
        console.log("PROPERTY VALUE STATS\nCSS: %d\nSASSVar: %d\nSASSScript: %d\n---------\nTotal: %d",
            totalCSSProperties,
            totalSASSVarProperties,
            totalSASSScriptProperties,
            totalProperties);
    }
});

