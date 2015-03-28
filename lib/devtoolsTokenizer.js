var CodeMirror = require("./runmode.node");
require("./css");
module.exports = function (mimeType)
{
    var mode = CodeMirror.getMode({indentUnit: 2}, mimeType);
    var state = CodeMirror.startState(mode);
    function tokenize(line, callback)
    {
        var stream = new CodeMirror.StringStream(line);
        while (!stream.eol()) {
            var style = mode.token(stream, state);
            var value = stream.current();
            callback(value, style, stream.start, stream.start + value.length);
            stream.start = stream.pos;
        }
    }
    return tokenize;
}
