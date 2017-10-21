const querystring = require("querystring");
const UrlHelper = require("../utils/url_helper");
const DocHelper = require("../utils/doc_helper");

const urlParse = /^\/(embed\/video|video|swf)\/([0-9a-zA-Z]*)/

function processDmUrl(text) {
    let urlData = UrlHelper.parse(text);
    const qs = querystring.parse(urlData.query);

    if (urlData.normalizedHost === "dailymotion.com") {
        const urlMatch = urlData.pathname.match(urlParse);
        if (urlMatch) {
            return {
                mediaid: urlMatch[2],
                height: null,
                width: null,
                allowFullscreen: null,
                loop: null,
                timestamp: qs.start || null,
                autoplay: qs.autoplay === "1" || qs.autoPlay === "1"
            }
        }

        return;
    }
}

function buildUrl (data, embed) {
    let url = embed ? "https://www.dailymotion.com/embed/video/" : "https://www.dailymotion.com/video/";
    const mediaid = data.mediaid.replace(/[^0-9a-zA-Z]/g, ""); // sanitize mediaid
    url += mediaid;

    let query = [];

    if (data.allowFullscreen === false) { query.push("fullscreen=1") }
    if (data.autoplay                 ) { query.push("autoplay=1");  }
    if (data.timestamp                ) { query.push("start=" + parseInt(data.timestamp)); }
    
    if (query.length > 0) {
        url += "?" + query.join("&");
    }

    return url;
}

module.exports = {
    detect: (text) => {
        // is entire text a url?
        let entire = processDmUrl(text);
        if (entire) {
            return entire;
        }

        for (const tag of DocHelper.get_nodes(text, "iframe", "embed", "a")) {
            switch (tag.nodeName.toLowerCase()) {
                case "embed":
                case "iframe":
                    ret = DocHelper.processIframe(tag, processDmUrl);
                    if (ret) {
                        return ret;
                    }
                    break;
                case "a":
                    ret = processDmUrl(tag.getAttribute("href"));
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
