"use strict";
const urlParse = /^\/(embed\/video|video|swf)\/([0-9a-zA-Z]*)/

module.exports = require("../platform_base")(
    function (urlData, qs) {
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
        }
    },
    function (data, embed, query) {
        let url = embed ? "https://www.dailymotion.com/embed/video/" : "https://www.dailymotion.com/video/";
        url += data.mediaid.replace(/[^0-9a-zA-Z]/g, ""); // sanitize mediaid
    
        query.when(data.allowFullscreen === false, "fullscreen=1");
        query.when(data.autoplay                 , "autoplay=1");
        query.when(data.timestamp                , "start=" + parseInt(data.timestamp));
        
        return url;
    }
);
