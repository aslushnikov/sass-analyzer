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
    //"hsla",
    //"hsl",
    "grayscale",
    "desaturate",
    //"red",
    //"blue",
    //"green",
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
    this.cssProperties = 0;
    this.sassVarProperties = 0;
    this.sassScriptProperties = 0;
    this.properties = 0;
    this._state = PropertyCounter.State.Init;
}

PropertyCounter.State = {
    Init: "Init",
    PropertyName: "PropertyName",
    CSSValue: "CSSValue",
    SASSVarValue: "SASSVarValue",
    SASSScriptValue: "SASSScriptValue"
}

PropertyCounter.prototype = {
    feed: function(token, type)
    {
        //console.log("%s => %s", token, type);
        // Skip whitespace tokens.
        if (!token.trim().length)
            return;
        // Skip comments.
        if (type && type.indexOf("comment") !== -1)
            return;
        var S = PropertyCounter.State;
        // Restore state to initial after every ";" and "}".
        if (type === null && (token === ";" || token === "}" || token === "\n")) {
            if (this._state === S.CSSValue)
                ++this.cssProperties;
            else if (this._state === S.SASSVarValue)
                ++this.sassVarProperties;
            else if (this._state === S.SASSScriptValue)
                ++this.sassScriptProperties;
            this._state = S.Init;
            return;
        }
        // If we find a property name, then start a new property.
        if (type === "property") {
            this._state = S.PropertyName;
            ++this.properties;
            return;
        }
        // If we find some SASS Script function, then this is a sass script value.
        if (funs.has(token)) {
            if (this._state !== S.Init)
                this._state = S.SASSScriptValue;
            return;
        }
        // If we find some variable reference...
        if (type && token && type.indexOf("variable") === 0 && token.indexOf("$") === 0) {
            if (this._state === S.PropertyName || this._state === S.CSSValue)
                this._state = S.SASSVarValue;
            else if (this._state !== S.Init)
                this._state = S.SASSScriptValue;
            return;
        }

        if (this._state === S.PropertyName) {
            if (token !== ":")
                this._state = S.CSSValue;
        } else if (this._state === S.CSSValue) {
            if (!type && "+-*/%".indexOf(token) !== -1)
                this._state = S.SASSScriptValue;
        }
    }
}

module.exports = PropertyCounter;
