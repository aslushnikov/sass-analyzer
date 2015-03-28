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
        // Update state.
        if (type === "property") {
            this._state = S.PropertyName;
            ++this.properties;
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
