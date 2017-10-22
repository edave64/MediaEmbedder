"use strict";
const urlParse = /^\/(video\/)?([0-9]*)$/;

/**
 * @param {string} videoId 
 * @param {object} param
 * @returns {MediaInfo}
 */
function generate (videoId, param) {
    return {
        mediaid: videoId,
        height: null, width: null, timestamp: null,
        allowFullscreen: null,
        loop: param.loop === "1",
        autoplay: param.autoplay === "1"
    }
}

module.exports = require("../platform_base")(
    function (urlData, qs) {
        if (urlData.normalizedHost === "vimeo.com" || urlData.normalizedHost === "player.vimeo.com") {
            if (urlData.pathname === "/moogaloop.swf") {
                return generate(qs.clip_id, qs);
            }
            const urlMatch = urlData.pathname.match(urlParse);
            if (urlMatch) {
                return generate(urlMatch[2], qs);
            }
        }
    },
    function (data, embed, query) {
        let url = embed ? "https://player.vimeo.com/video/" : "https://vimeo.com/";
        url += data.mediaid.replace(/[^0-9]/g, ""); // sanitize mediaid
    
        query.when(data.loop,     "loop=1");
        query.when(data.autoplay, "autoplay=1");

        return url;
    }
);
