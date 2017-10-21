# MediaEmbed

MediaEmbed is a javascript library for parsing and creating links and embedding codes for media hosting services. While parsing, it also supports outdated embedding codes, so it can be used to get rid of flash-player embeds.

Currently, these services are supported:

* Youtube
* Dailymotion
* Vimeo

## Example

```javascript
const MediaEmbed = require('./index');

const mediaData = MediaEmbed.detect(`
    <object height="344" width="425">
        <param name="movie" value="http://www.youtube.com/v/DLzxrzFCyOs&hl=pl&fs=1&color1=0xcc2550&color2=0xe87a9f">
        <param name="allowFullScreen" value="true">
        <param name="allowscriptaccess" value="always">
        <embed allowfullscreen="true" allowscriptaccess="always" height="344" src="http://www.youtube.com/v/DLzxrzFCyOs&fs=1&color1=0xcc2550&color2=0xe87a9f" type="application/x-shockwave-flash" width="425"></embed>
    </object>
`)
```

Returns this object:

```javascript
{ mediaid: 'DLzxrzFCyOs',
    height: '344',
    width: '425',
    timestamp: null,
    allowFullscreen: true,
    loop: false,
    autoplay: false,
    platform: 'youtube' }
```

From that you can generate a new embed code:

```javascript
MediaEmbed.buildIframe(mediaData); //=> '<iframe height="344" width="425" allowfullscreen webkitallowfullscreen mozallowfullscreen frameborder="0" src="https://www.youtube.com/embed/DLzxrzFCyOs"></iframe>'
```

Or a direct link URL:

```javascript
MediaEmbed.buildLink(mediaData); //=> 'https://www.youtube.com/watch?v=DLzxrzFCyOs'
```