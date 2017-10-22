const vimeo = require("../platforms/vimeo");

test('parsing vimeo url', () => {
    expect(vimeo.detect("https://vimeo.com/000000000")).toEqual({
        "allowFullscreen": null,
        "autoplay": false,
        "height": null,
        "loop": false,
        "mediaid": "000000000",
        "timestamp": null,
        "width": null
    });
});

test('parsing vimeo iframe', () => {
    expect(vimeo.detect('<iframe width="560" height="315" src="https://player.vimeo.com/video/000000000?loop=1&autoplay=1" frameborder="0" allowfullscreen></iframe>')).toEqual({
        "allowFullscreen": true,
        "autoplay": true,
        "height": "315",
        "loop": true,
        "mediaid": "000000000",
        "timestamp": null,
        "width": "560"
    });
});

test('parsing vimeo flash embed', () => {
    expect(vimeo.detect(`
        <object height="225" width="400"><param name="allowfullscreen" value="true">
            <param name="allowscriptaccess" value="always">
            <param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=000000000&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1">
            <embed allowfullscreen="true" allowscriptaccess="always" height="225" src="http://vimeo.com/moogaloop.swf?clip_id=000000000&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1" type="application/x-shockwave-flash" width="400"></embed>
        </object>`)
    ).toEqual({
        "allowFullscreen": true,
        "autoplay": false,
        "height": "225",
        "loop": false,
        "mediaid": "000000000",
        "timestamp": null,
        "width": "400"
    });
});
