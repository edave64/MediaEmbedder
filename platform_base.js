"use strict";

const querystring = require("querystring");
const UrlHelper = require("./utils/url_helper");
const DocHelper = require("./utils/doc_helper");

/**
 * @callback processor
 * @param {UrlObject} url
 * @param {Object} queryObject
 * @return {MediaInfo}
 */

/**
 * @callback generator
 * @param {MediaInfo} mediaInfo
 * @param {boolean} embedded
 * @param {string[]} queryParts
 * @returns {string} Url
 */

/**
 * @param {processor} urlProcessor
 * @param {generator} urlGenerator
 * @returns {MediaPlatform}
 */
module.exports = function (urlProcessor, urlGenerator) {
    function wrappedProcessor (text) {
        try {
            const urlData = UrlHelper.parse(text);
            const qs = querystring.parse(urlData.query);

            return urlProcessor(urlData, qs);
        } catch (e) {
            console.error(e);
        }
    }

    function wrappedGenerator (data, embed) {
        const queryData = [];
        queryData.when = function (condition, val) { if (condition) this.push(val); };
        let url = urlGenerator(data, embed, queryData);
        
        if (queryData.length > 0) {
            url += "?" + queryData.join("&");
        }
        return url;
    }
    
    return {
        detect: (text) => {
            // is entire text a url?
            let entire = wrappedProcessor(text),
                ret;
            if (entire) {
                return entire;
            }
            
            for (const tag of DocHelper.get_nodes(text, "iframe", "embed", "a")) {
                switch (tag.nodeName.toLowerCase()) {
                    case "iframe":
                    case "embed":
                        ret = DocHelper.processIframe(tag, wrappedProcessor);
                        if (ret) {
                            return ret;
                        }
                        break;
                    case "a":
                        ret = wrappedProcessor(tag.getAttribute("href"));
                        if (ret) {
                            return ret;
                        }
                        break;
                }
            }
        },
        buildIframe: (data) => {
            return DocHelper.buildIframe(wrappedGenerator(data, true), data.height, data.width, data.allowFullscreen);
        },
        buildLink: (data) => {
            return wrappedGenerator(data, false);
        }
    };
};
