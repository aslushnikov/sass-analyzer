var fs = require("fs")
  , ProgressBar = require("progress")
  , fileStats = require("./FileStats")
  , path = require("path")

var directory = process.argv[2];
if (!directory) {
    console.error("Usage: node propStats.js <directory with .scss files>");
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

    var index = 0;
    function peekFile(err, stats)
    {
        bar.tick();
        if (stats) {
            totalProperties += stats.properties;
            totalCSSProperties += stats.cssProperties;
            totalSASSVarProperties += stats.sassVarProps;
            totalSASSScriptProperties += stats.sassScriptProps;
        }
        if (index === files.length) {
            console.log("PROPERTY VALUE STATS\nCSS: %d\nSASSVar: %d\nSASSScript: %d\n---------\nTotal: %d",
                totalCSSProperties,
                totalSASSVarProperties,
                totalSASSScriptProperties,
                totalProperties);
            return;
        }
        var fileName = files[index++];
        var filePath = path.join(directory, fileName);
        fileStats(filePath, peekFile);
    }
    peekFile();
});

