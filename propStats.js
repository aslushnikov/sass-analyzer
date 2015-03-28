var createTokenizer = require("./lib/devtoolsTokenizer")
  , PropertyCounter = require("./PropertyCounter")
  , fs = require("fs")
  , ProgressBar = require('progress')

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
    var totalComplex = 0
      , totalProperties = 0
      , filesWithComplexProperties = 0

    // Fancy UI.
    var bar = new ProgressBar(':bar', { total: files.length });

    var index = 0;
    var perFileStats;
    function peekFile()
    {
        bar.tick();
        if (perFileStats) {
            totalProperties += perFileStats.properties;
            totalComplex += perFileStats.complexProperties;
            if (perFileStats.complexProperties > 0)
                ++filesWithComplexProperties;
        }
        if (index === files.length) {
            console.log("Files with complex properties: %d/%d\n Complex properties: %d/%d",
                filesWithComplexProperties,
                files.length,
                totalComplex,
                totalProperties);
            return;
        }
        perFileStats = new PropertyCounter();
        statsForFile(directory + "/" + files[index++], perFileStats, peekFile);
    }
    peekFile();
});

function statsForFile(fileName, counter, callback)
{
    fs.readFile(fileName, "utf-8", function(err, text) {
        if (err || !text) {
            console.error("Cannot read " + fileName);
            callback();
            return;
        }

        var tokenize = createTokenizer("text/x-scss");
        tokenize(text, counter.feed.bind(counter));
        callback();
    });
}
