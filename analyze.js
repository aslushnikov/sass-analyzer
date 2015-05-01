var fs = require("fs")
  , ProgressBar = require("progress")
  , fileStats = require("./FileStats")
  , path = require("path")
  , CreateBlockingQueue = require("block-queue")
  , program = require("commander")

program
    .version("0.1.0")
    .usage("[options] <dir>")
    .option("-p, --parallel <n>", "Parallel factor", parseInt)
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

    var TERMINATION = {};

    // Fancy UI.
    var bar = new ProgressBar(":bar", { total: files.length });
    var parallel = program.parallel || 1;
    console.log("Analyzing " + files.length + " files in " + parallel + " threads...");
    var queue = CreateBlockingQueue(parallel, function(fileName, done) {
        if (fileName === TERMINATION)
            outputStats();
        else
            fileStats(fileName, onStats.bind(null, done));
    });

    function onStats(done, err, stats) {
        bar.tick();
        if (stats) {
            totalProperties += stats.properties;
            totalCSSProperties += stats.cssProperties;
            totalSASSVarProperties += stats.sassVarProps;
            totalSASSScriptProperties += stats.sassScriptProps;
        }
        done();
    }

    function outputStats() {
        console.log("PROPERTY VALUE STATS\nCSS: %d\nSASSVar: %d\nSASSScript: %d\n---------\nTotal: %d",
            totalCSSProperties,
            totalSASSVarProperties,
            totalSASSScriptProperties,
            totalProperties);
    }

    for (var i = 0; i < files.length; ++i)
        queue.push(path.join(directory, files[i]));
    queue.push(TERMINATION);
});

