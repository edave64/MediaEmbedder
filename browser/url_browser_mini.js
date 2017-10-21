module.exports = {
    parse: function (text) {
        var a = document.createElement("a");
        a.href = text;
        a.query = a.search.substring(1);
        return a;
    }
};
