import express from 'express'
import { createCanvas, loadImage, registerFont } from 'canvas'

const app = express()
const port = process.env.PORT || 3000

app.get('/hero', async (req, res) => {
    const title = req.query.title || 'NEED A TITLE'
    const subTitle = req.query.subTitle || null
    const style = req.query.style || 'blurry-gradient'
    const shape = req.query.shape || '16:9'
    const fontSize = req.query.fontSize || 96
    const subFontSize = req.query.subFontSize || fontSize / 2
    const fontColor = req.query.fontColor || '#FFFFFF'

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
        console.error('Error loading background image:', error)
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
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