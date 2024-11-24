const path = require('path');
const express = require('express')
const { createCanvas, loadImage, registerFont } = require('canvas')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'doc', 'help.html'));
});

app.get('/hero', async (req, res) => {
    const title = req.query.title || 'NEED A TITLE'
    const subTitle = req.query.subTitle || null
    const style = req.query.style || 'blurry-gradient'
    const shape = req.query.shape || '16:9'
    const fontSize = req.query.fontSize || 96
    const subFontSize = req.query.subFontSize || fontSize / 2
    const fontColor = req.query.fontColor || '#FFFFFF'

    console.log('Get a new request:\n\tTitle:', title, '\n\tSubTitle:', subTitle, '\n\tStyle:', style, '\n\tShape:', shape, '\n\tFont Size:', fontSize, '\n\tSub Font Size:', subFontSize, '\n\tFont Color:', fontColor)

    // verify fontColor
    reg = /^#[0-9a-fA-F]{6}$/i
    if (!reg.test(fontColor)) {
        console.error('Invalid font color:', fontColor)
        res.status(400).send('Invalid font color')
        return
    }

    // verify fontSize
    if (isNaN(fontSize) || fontSize < 0) {
        console.error('Invalid headline font size:', fontSize)
        res.status(400).send('Invalid headline font size')
        return
    }

    // verify subFontSize
    if (isNaN(subFontSize) || subFontSize < 0) {
        console.error('Invalid subtitle font size:', subFontSize)
        res.status(400).send('Invalid subtitle font size')
        return
    }

    let width = null
    let height = null
    switch (shape) {
        // image.width = 960
        // image.height = 540
        case '16:9':
            width = 960
            height = 540
            break
        case '4:3':
            width = 720
            height = 540
            break
        case '1:1':
            width = 540
            height = 540
            break
        default:
            console.error('Invalid shape:', shape)
            width = 960
            height = 540
            break
    }

    let backgroundImage = null
    switch (style) {
        case 'blob':
            backgroundImage = './src/assets/image/blob.svg'
            break
        case 'wave':
            backgroundImage = './src/assets/image/wave.svg'
            break
        case 'blurry-gradient':
            backgroundImage = './src/assets/image/blurry-gradient.svg'
            break
        case 'blob-scene':
            backgroundImage = './src/assets/image/blob-scene.svg'
            break
        case 'layered-waves':
            backgroundImage = './src/assets/image/layered-waves.svg'
            break
        case 'layered-peaks':
            backgroundImage = './src/assets/image/layered-peaks.svg'
            break
        default:
            console.error('Invalid style:', style)
            backgroundImage = './src/assets/image/blurry-gradient.svg'
            break
    }

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // registerFont('./src/assets/font/Roboto-Regular.ttf', { family: 'Roboto' })

    try {
        const image = await loadImage(backgroundImage)
        ctx.drawImage(
            image,
            (image.width - canvas.width) / 2,
            (image.height - canvas.height) / 2,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        )
    } catch (error) {
        console.error('Unexpected error:', error)
        res.status(500).send('Unexpected error')
        return
    }

    if (title) {
        ctx.fillStyle = fontColor
        ctx.font = `bold ${fontSize}px Sans-serif`
        ctx.textAlign = 'center'
        if (subTitle) {
            ctx.fillText(title, canvas.width / 2, canvas.height / 2 - subFontSize / 4)
        } else {
            ctx.fillText(title, canvas.width / 2, canvas.height / 2)
        }
    }
    if (subTitle) {
        ctx.fillStyle = fontColor
        ctx.font = `normal ${subFontSize}px Sans-serif`
        ctx.textAlign = 'center'
        ctx.globalAlpha = 0.5
        if (title) {
            ctx.fillText(subTitle, canvas.width / 2, canvas.height / 2 + subFontSize / 4 * 5)
        } else {
            ctx.fillText(subTitle, canvas.width / 2, canvas.height / 2)
        }
    }

    res.setHeader('Content-Type', 'image/png')
    canvas.createPNGStream().pipe(res)
});

app.listen(port, () => {
    console.log(`Server is running`)
});