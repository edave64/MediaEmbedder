module.exports = {
    parse: function (text) {
        const a = document.createElement("a");
        a.href = text;
        a.query = a.search.substring(1);
        return a;
    }
};
