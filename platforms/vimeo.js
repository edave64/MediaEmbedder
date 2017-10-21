const querystring = require("querystring");
const UrlHelper = require("../utils/url_helper");
const DocHelper = require("../utils/doc_helper");

const urlParse = /^\/(video\/)?([0-9]*)$/

/**
 * @param {string} videoId 
 * @param {object} param
 * @returns {MediaInfo}
 */
function generate (videoId, param) {
    return {
        mediaid: videoId,
        height: null, width: null, timestamp: null,
        allowFullscreen: param.fullscreen === "1",
        loop: param.loop === "1",
        autoplay: param.autoplay === "1"
    }
}

/**
 * @param {string} text
 * @returns {MediaInfo}
 */
function processVimeoUrl(text) {
    let urlData = UrlHelper.parse(text);
    const qs = querystring.parse(urlData.query);

    if (urlData.normalizedHost === "vimeo.com" || urlData.normalizedHost === "player.vimeo.com") {
        if (urlData.pathname === "/moogaloop.swf") {
            return generate(qs.clip_id, qs);
        }
        const urlMatch = urlData.pathname.match(urlParse);
        if (urlMatch) {
            return generate(urlMatch[2], qs);
        }

        return;
    }
}

/**
 * @param {MediaInfo} data 
 * @param {boolean} embed 
 */
function buildUrl (data, embed) {
    let url = embed ? "https://player.vimeo.com/video/" : "https://vimeo.com/";
    const mediaid = data.mediaid.replace(/[^0-9]/g, ""); // sanitize mediaid
    url += mediaid;

    let query = [];

    if (data.allowFullscreen === false) { query.push("fullscreen=1") }
    if (data.loop                     ) { query.push("loop=1");      }
    if (data.autoplay                 ) { query.push("autoplay=1");  }
    
    if (query.length > 0) {
        url += "?" + query.join("&");
    }

    return url;
}


module.exports = {
    detect: (text) => {
        // is entire text a url?
        let entire = processVimeoUrl(text);
        if (entire) {
            return entire;
        }

        for (const tag of DocHelper.get_nodes(text, "iframe", "embed", "a")) {
            switch (tag.nodeName.toLowerCase()) {
                case "embed":
                case "iframe":
                    ret = DocHelper.processIframe(tag, processVimeoUrl);
                    if (ret) {
                        return ret;
                    }
                    break;
                case "a":
                    ret = processVimeoUrl(tag.getAttribute("href"));
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
