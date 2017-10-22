const dailymotion = require("../platforms/dailymotion");

test('parsing dailymotion url', () => {
    expect(dailymotion.detect("https://www.dailymotion.com/video/0000000")).toEqual({
        "allowFullscreen": null,
        "autoplay": false,
        "height": null,
        "loop": null,
        "mediaid": "0000000",
        "timestamp": null,
        "width": null
    });
});

test('parsing dailymotion iframe', () => {
    expect(dailymotion.detect('<iframe frameborder="0" width="480" height="270" src="//www.dailymotion.com/embed/video/0000000?autoPlay=1&start=600" allowfullscreen=""></iframe>')).toEqual({
        "allowFullscreen": true,
        "autoplay": true,
        "height": "270",
        "loop": null,
        "mediaid": "0000000",
        "timestamp": "600",
        "width": "480"
    });
});

test('parsing dailymotion flash embed', () => {
    expect(dailymotion.detect(`
        <object height="341" width="480"><param name="movie" value="http://www.dailymotion.com/swf/0000000_stuff">
            <param name="allowFullScreen" value="true">
            <param name="allowScriptAccess" value="always">
            <embed allowfullscreen="true" allowscriptaccess="always" height="341" src="http://www.dailymotion.com/swf/0000000_stuff" type="application/x-shockwave-flash" width="480"></embed>
        </object>
    `)
    ).toEqual({
        "allowFullscreen": true,
        "autoplay": false,
        "height": "341",
        "loop": null,
        "mediaid": "0000000",
        "timestamp": null,
        "width": "480"
    });
});
