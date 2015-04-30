var assert = require("assert")
  , path = require("path")
  , fileStats = require("../FileStats")

function test(fileName, cssProperties, sassVarProps, sassScriptProps, properties, done) {
    var filePath = path.join("test", "assets", fileName);
    fileStats(filePath, onStats);

    function onStats(error, stats) {
        assert.ok(!error, error);
        // console.log(JSON.stringify(stats));
        assert.equal(stats.sassScriptProps, sassScriptProps, "SASS SCRIPT properties don't match");
        assert.equal(stats.sassVarProps, sassVarProps, "SASS VAR properties don't match");
        assert.equal(stats.cssProperties, cssProperties, "CSS properties don't match");
        assert.equal(stats.properties, properties, "Total properties don't match");
        done();
    }
}

function testBind(fileName, cssProperties, sassVarProps, sassScriptProps, properties) {
    return test.bind(null, fileName, cssProperties, sassVarProps, sassScriptProps, properties);
}

describe("FileStats", function(){
    it("test #1", testBind("1.scss", 0, 2, 0, 2));
    it("test #2", testBind("2.scss", 7, 0, 0, 7));
    it("test #3", testBind("3.scss", 2, 0, 0, 2));
    it("test #4", testBind("4.scss", 0, 4, 0, 4));
    it("test #5", testBind("5.scss", 6, 0, 0, 6));
    it("test #6", testBind("6.scss", 3, 0, 2, 5));
})
