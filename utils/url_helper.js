const url = require("url");
const querystring = require("querystring");

module.exports = {
    parse: function (text) {
        let fullUrl = url.parse(text);
    
        if (fullUrl.protocol === null) {
            fullUrl = url.parse("test:" + (text.startsWith("//") ? "" : "//") + text);
        }

        if (fullUrl.host) {
            fullUrl.normalizedHost = fullUrl.host.startsWith("www.") ? fullUrl.host.substring(4) : fullUrl.host;
        }

        return fullUrl;
    }
};
