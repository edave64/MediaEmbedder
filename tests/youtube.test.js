const youtube = require("../platforms/youtube");

test('parsing youtube url', () => {
    expect(youtube.detect("https://www.youtube.com/watch?v=00000000000")).toEqual({
        "allowFullscreen": true,
        "autoplay": false,
        "height": null,
        "loop": false,
        "mediaid": "00000000000",
        "timestamp": null,
        "width": null
    });
});

test('parsing youtube iframe', () => {
    expect(youtube.detect('<iframe width="560" height="315" src="https://www.youtube.com/embed/00000000000?start=600&autoplay=1&loop=1" frameborder="0" allowfullscreen></iframe>')).toEqual({
        "allowFullscreen": true,
        "autoplay": true,
        "height": "315",
        "loop": true,
        "mediaid": "00000000000",
        "timestamp": "600",
        "width": "560"
    });
});

test('parsing youtube flash embed', () => {
    expect(youtube.detect(`
        <object height="344" width="425"><param name="movie" value="http://www.youtube.com/v/00000000000&hl=pl&fs=1&color1=0xcc2550&color2=0xe87a9f">
            <param name="allowFullScreen" value="true">
            <param name="allowscriptaccess" value="always">
            <embed allowfullscreen="true" allowscriptaccess="always" height="344" src="http://www.youtube.com/v/00000000000&hl=pl&fs=1&color1=0xcc2550&color2=0xe87a9f" type="application/x-shockwave-flash" width="425"></embed>
        </object>`)
    ).toEqual({
        "allowFullscreen": true,
        "autoplay": false,
        "height": "344",
        "loop": false,
        "mediaid": "00000000000",
        "timestamp": null,
        "width": "425"
    });
});
