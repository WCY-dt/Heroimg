# Heroimg

![Heroimg](https://heroimg.glitch.me/hero?style=blob&title=Heroimg&subTitle=Transforming%20Words%20into%20Stunning%20Visuals!&subFontSize=32)

Heroimg is an image generator that transforms words into stunning visuals. You can use it to create images for your social media posts, blog posts, or any other purpose.

## API Usage

Hero can be accessed via  [`https://heroimg.glitch.me/`](https://heroimg.glitch.me/).

Heroimg currently has only one API endpoint available, you should use the GET method to access it:

| Method | URL | Description |
|--------|-----|-------------|
| GET    | [/hero](#hero-parameters) | Generate an image with text on it |

### `/hero` Parameters

The following parameters are available for the API:

| Parameter   | Type   | Description                                      | Options                                                                 | Default            |
|-------------|--------|--------------------------------------------------|------------------------------------------------------------------------|--------------------|
| `title`     | string | Headline text to be displayed on the image       | /                                                                      | `NEED A TITLE`     |
| `subtitle`  | string | Subtitle or copyright text to be displayed on the image | /                                                                      | /                  |
| `style`     | string | Style of the image background                    | `blob`<br>`wave`<br>`blurry-gradient`<br>`blob-scene`<br>`layered-waves`<br>`layered-peaks` | `blurry-gradient`  |
| `shape`     | string | Shape of the image                               | `16:9`<br>`4:3`<br>`1:1`                                               | `16:9`             |
| `fontSize`  | number | Font size of the headline text                   | /                                                                      | `96`               |
| `subFontSize` | number | Font size of the subtitle text                   | /                                                                      | `fontSize / 2`     |
| `fontColor` | string | Color of the text                                | /                                                                      | `#ffffff`          |

#### Response

The API returns an image with the specified text on it. The image is in PNG format.

If the parameters are invalid, the API returns a `400 Bad Request` response. If the image cannot be generated, the API returns a `500 Internal Server Error` response.

#### Example

[https://heroimg.glitch.me/hero?title=Hello%20World&subtitle=Heroimg&style=wave&shape=16:9&fontSize=96&subFontSize=48&fontColor=%23ffffff](https://heroimg.glitch.me/hero?title=Hello%20World&subtitle=Heroimg&style=wave&shape=16:9&fontSize=96&subFontSize=48&fontColor=%23ffffff)

#### Style Previews

| `blob` | `wave` | `blurry-gradient` | `blob-scene` | `layered-waves` | `layered-peaks` |
|--------|--------|-------------------|--------------|-----------------|-----------------|
| ![blob](https://heroimg.glitch.me/hero?style=blob&title=Heroimg&subTitle=blob) | ![wave](https://heroimg.glitch.me/hero?style=wave&title=Heroimg&subTitle=wave) | ![blurry-gradient](https://heroimg.glitch.me/hero?style=blurry-gradient&title=Heroimg&subTitle=blurry-gradient) | ![blob-scene](https://heroimg.glitch.me/hero?style=blob-scene&title=Heroimg&subTitle=blob-scene) | ![layered-waves](https://heroimg.glitch.me/hero?style=layered-waves&title=Heroimg&subTitle=layered-waves) | ![layered-peaks](https://heroimg.glitch.me/hero?style=layered-peaks&title=Heroimg&subTitle=layered-peaks) |

#### Size Previews

| `16:9` | `4:3` | `1:1` |
|--------|-------|-------|
| ![16:9](https://heroimg.glitch.me/hero?shape=16:9&title=Heroimg&subTitle=16:9) | ![4:3](https://heroimg.glitch.me/hero?shape=4:3&title=Heroimg&subTitle=4:3) | ![1:1](https://heroimg.glitch.me/hero?shape=1:1&title=Heroimg&subTitle=1:1) |

## Self-hosting

This is a Node.js project. To host it yourself, you only need to clone this repository and run the following commands:

```bash
npm install
npm run start
```

It also supports hot-reloading with `nodemon`:

```bash
npm run dev
```

You can also deploy this project to Glitch by clicking the following button:

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button-v2.svg)](https://glitch.com/edit/#!/remix/Heroimg)

## Acknowledgements

The project is hosted on [Glitch](https://glitch.com/).
