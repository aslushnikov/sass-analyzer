var createTokenizer = require("./lib/devtoolsTokenizer")
  , PropertyCounter = require("./PropertyCounter")
  , fs = require("fs")

function fileStats(fileName, callback)
{
    fs.readFile(fileName, "utf-8", function(err, text) {
        if (err) {
            callback(err, null);
            return;
        }

        var counter = new PropertyCounter();
        var tokenize = createTokenizer("text/x-scss");
        tokenize(text, counter.feed.bind(counter));
        callback(null, {
            properties: counter.properties,
            cssProperties: counter.cssProperties,
            sassVarProps: counter.sassVarProperties,
            sassScriptProps: counter.sassScriptProperties
        });
    });
}

module.exports = fileStats;
