const DOMParser = require("xmldom").DOMParser;

module.exports = {
    get_nodes: function (text, ...node_types) {
        let parser = (new DOMParser ({errorHandler:{warning:function(){}}})).parseFromString("<html><body>" + text + "</body></html>", "text/html");
        var tags = [];
        for (const node_type of node_types) {
            tags.push.apply(tags, parser.getElementsByTagName(node_type));
        }
        return tags;
    },

    processIframe: function (iframe, urlProcessor) {
        const ret = urlProcessor(iframe.getAttribute("src"));
        if (ret) {
            ret.allowFullscreen = iframe.getAttribute("allowfullscreen") != null;
            ret.height = iframe.getAttribute("height");
            ret.width = iframe.getAttribute("width");
            return ret;
        }
    },

    buildIframe: function (src, height, width, allowFullscreen) {
        let ret = "<iframe "
        if (height != null) {
            ret += 'height="' + parseInt(height) + '" '
        }
        if (width != null) {
            ret += 'width="' + parseInt(width) + '" '
        }
        if (allowFullscreen === true) {
            ret += 'allowfullscreen webkitallowfullscreen mozallowfullscreen '
        }
        ret += 'frameborder="0" src="' + src + '"></iframe>'
        return ret;
    }
};
