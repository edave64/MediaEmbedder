const querystring = require("querystring");
const UrlHelper = require("../utils/url_helper");
const DocHelper = require("../utils/doc_helper");

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

function processYoutubeUrl(text) {
    let urlData = UrlHelper.parse(text);
    const qs = querystring.parse(urlData.query);

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

        return;
    }

    if (urlData.normalizedHost === "youtu.be") {
        const qs = querystring.parse(urlData.query);
        return generate(urlData.pathname.slice(1), qs);
    }
}

function buildUrl (data, embed) {
    let url = embed ? "https://www.youtube.com/embed/" : "https://www.youtube.com/watch";
    const mediaid = data.mediaid.replace(/[^0-9a-zA-Z\-_]/g, ""); // sanitize mediaid

    let query = [];

    if (embed) {
        url += mediaid;
    } else {
        query.push("v=" + mediaid)
    }
    if (data.allowFullscreen === false) { query.push("fs=1")        }
    if (data.loop                     ) { query.push("loop=1");     }
    if (data.autoplay                 ) { query.push("autoplay=1"); }
    if (data.timestamp                ) { query.push("start=" + data.timestamp.replace(/[^0-9hms]/g, "")); }
    
    if (query.length > 0) {
        url += "?" + query.join("&");
    }

    return url;
}

module.exports = {
    detect: (text) => {
        // is entire text a url?
        let entire = processYoutubeUrl(text);
        if (entire) {
            return entire;
        }
        
        for (const tag of DocHelper.get_nodes(text, "iframe", "embed", "a")) {
            switch (tag.nodeName.toLowerCase()) {
                case "iframe":
                case "embed":
                    ret = DocHelper.processIframe(tag, processYoutubeUrl);
                    if (ret) {
                        return ret;
                    }
                    break;
                case "a":
                    ret = processYoutubeUrl(tag.getAttribute("href"));
                    if (ret) {
                        return ret;
                    }
                    break;
            }
        }
    },
    buildIframe: (data) => {
        return DocHelper.buildIframe(buildUrl(data, true), data.height, data.width, data.allowFullscreen);
    },
    buildLink: (data) => {
        return buildUrl(data, false);
    }
};
