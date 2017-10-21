/**
 * @typedef MediaInfo
 * @name MediaInfo
 * @type {object}
 * @property {string} platform - The name of the media platfrom.
 * @property {string} mediaid - A string uniquely identifying on piece of media on the platform
 * @property {number?} height - The height of the embeded player
 * @property {number?} width - The width of the embeded player
 * @property {boolean?} allowFullscreen - True if the player can enter fullscreen
 * @property {boolean?} loop - True if the player will start over at the end
 * @property {number?} timestamp - The number of seconds at the begining that will be skiped
 */

/**
 * @typedef MediaPlatform
 * @name MediaPlatform
 */

/**
 * Parses a text can either be a url to a video on a platform, or an html
 * snipplet containing an embedding code for one of these platforms.
 * 
 * It attemps to extract as much information as possible from this text.
 * 
 * @method MediaPlatform~detect
 * @param {string} test - A URL or an html snipplet containing an embed code
 * @returns {MediaInfo?} Information found in the string, undefined if none where found.
 */

/**
 * Generates a iframe embed html snipplet from a descriptor
 * 
 * @method MediaPlatform~buildIframe
 * @param {MediaInfo} descriptor
 * @returns {string} An html snipplet
 */

/**
 * Generates a link url from a descriptor
 * 
 * @method MediaPlatform~buildLink
 * @param {MediaInfo} descriptor
 * @returns {string} A url
 */

/** @type {Object.<string, MediaPlatform>} */
const platforms = {
    youtube: require("./platforms/youtube"),
    dailymotion: require("./platforms/dailymotion"),
    vimeo: require("./platforms/vimeo")
};

/** @type {MediaPlatform} */
module.exports = {
    detect: function(text) {
        for (const platform in platforms) {
            const ret = platforms[platform].detect(text);
            if (ret) {
                ret.platform = platform;
                return ret;
            }
        }
    },
    buildIframe: function (descriptor) {
        var platform = platforms[descriptor.platform];
        return platform.buildIframe(descriptor);
    },
    buildLink: function (descriptor) {
        var platform = platforms[descriptor.platform];
        return platform.buildLink(descriptor);
    }
}
