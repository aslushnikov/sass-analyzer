// A set of SASS Script functions.
var funs = new Set([
    // Math functions.
    "abs",
    "append",
    "ceil",
    "floor",
    "index",
    "join",
    "keywords",
    "length",
    "list-separator",
    "map-get",
    "map-has-key",
    "map-keys",
    "map-merge",
    "map-remove",
    "map-values",
    "max",
    "min",
    "nth",
    "percentage",
    "quote",
    "random",
    "round",
    "set-nth",
    "str-index",
    "str-insert",
    "str-length",
    "str-slice",
    "to-lower-case",
    "to-upper-case",
    "unquote",
    "zip",
    // Color functions.
    "darken",
    "lighten",
    "alpha",
    "transparentize",
    "hue",
    "scale-color",
    "lightness",
    "mix",
    "adjust-hue",
    "hsla",
    "hsl",
    "grayscale",
    "desaturate",
    "red",
    "blue",
    "green",
    "invert",
    "saturation",
    "adjust-color",
    "saturate",
    "ie-hex-str",
    "opacify",
    "change-color",
    "complement",
]);
var PropertyCounter = function()
{
    this.simpleProperties = 0;
    this.complexProperties = 0;
    this.properties = 0;
    this._state = PropertyCounter.State.Init;
}

PropertyCounter.State = {
    Init: "Init",
    PropertyName: "PropertyName",
    SimpleValue: "SimpleValue",
    ComplexValue: "ComplexValue"
}

PropertyCounter.prototype = {
    feed: function(token, type)
    {
        // Skip whitespace tokens.
        if (!token.trim().length)
            return;
        // Skip comments.
        if (type && type.indexOf("comment") !== -1)
            return;
        var S = PropertyCounter.State;
        // Restore state to initial after every ";" and "}".
        if (type === null && (token === ";" || token === "}" || token === "\n")) {
            if (this._state === S.SimpleValue)
                ++this.simpleProperties;
            else if (this._state === S.ComplexValue)
                ++this.complexProperties;
            this._state = S.Init;
            return;
        }
        // If we find a property name, then start a new property.
        if (type === "property") {
            this._state = S.PropertyName;
            ++this.properties;
            return;
        }
        // If we find some SASS Script function, then this is a complex property.
        if ((this._state === S.PropertyName || this._state === S.SimpleValue) && funs.has(token)) {
            this._state = S.ComplexValue;
            return;
        }
        if (this._state === S.PropertyName) {
            if (token !== ":")
                this._state = S.SimpleValue;
        } else if (this._state === S.SimpleValue) {
            if (!type && "+-*/%".indexOf(token) !== -1)
                this._state = S.ComplexValue;
        }
    }
}

module.exports = PropertyCounter;
