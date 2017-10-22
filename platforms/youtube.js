const querystring = require("querystring");
const embedUrlParse = /^\/(embed|v)\/([0-9a-zA-Z\-_]*)(.*)/

function generate (videoId, param) {
    return {
        mediaid: videoId,
        height: null, width: null,
        allowFullscreen: param.fs !== "0",
        timestamp: param.t || param.time || param.start || null,
        loop: param.loop === "1",
        autoplay: param.autoplay === "1"
    }
}

module.exports = require("../platform_base")(
    function (urlData, qs) {
        if (urlData.normalizedHost === "youtube.com") {
            if (qs.v) {
                return generate(qs.v, qs);
            }
            const embedUrlMatch = urlData.pathname.match(embedUrlParse);
            if (embedUrlMatch) {
                // youtube /v/ urls can be kind of odd and and append the query with & to the path
                const vUrlQs = querystring.parse(embedUrlMatch[3]);
                return generate(embedUrlMatch[2], Object.assign({}, qs, vUrlQs));
            }
        } else if (urlData.normalizedHost === "youtu.be") {
            const qs = querystring.parse(urlData.query);
            return generate(urlData.pathname.slice(1), qs);
        }
    },
    function (data, embed, query) {
        let url = embed ? "https://www.youtube.com/embed/" : "https://www.youtube.com/watch";
        const mediaid = data.mediaid.replace(/[^0-9a-zA-Z\-_]/g, ""); // sanitize mediaid
    
        query.when(data.allowFullscreen === false, "fs=1");
        query.when(data.loop,                      "loop=1");
        query.when(data.autoplay,                  "autoplay=1");
        if (data.timestamp) {
            query.push("start=" + data.timestamp.replace(/[^0-9hms]/g, ""));
        }

        if (embed) {
            url += mediaid;
        } else {
            query.push("v=" + mediaid)
        }

        return url;
    }
);
