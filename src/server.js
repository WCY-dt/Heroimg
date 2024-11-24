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
    const reg = /^#[0-9a-fA-F]{6}$/i
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
    const shapes = {
        '16:9': () => { return { width: 960, height: 540 } },
        '4:3': () => { return { width: 720, height: 540 } },
        '1:1': () => { return { width: 540, height: 540 } }
    }
    if (shapes.hasOwnProperty(shape)) {
        const { width: w, height: h } = shapes[shape]()
        width = w
        height = h
    } else {
        console.error('Invalid shape:', shape)
        res.status(400).send('Invalid shape')
        return
    }

    let backgroundImage = null
    const backgroundImages = [
        'blob',
        'wave',
        'blurry-gradient',
        'blob-scene',
        'layered-waves',
        'layered-peaks'
    ]
    if (backgroundImages.includes(style)) {
        backgroundImage = `./src/assets/image/${style}.svg`
    } else {
        console.error('Invalid style:', style);
        backgroundImage = './src/assets/image/blurry-gradient.svg';
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

    const maxTextWidth = canvas.width * 0.9
    const titleLineHeight = fontSize * 1.1
    const subTitleLineHeight = subFontSize * 1.1

    ctx.fillStyle = fontColor
    ctx.textAlign = 'center'
    const titleFont = `bold ${fontSize}px Sans-serif`
    const subTitleFont = `normal ${subFontSize}px Sans-serif`
    const titleAlpha = 1
    const subTitleAlpha = 0.5

    let titleLines = []
    let subTitleLines = []
    let titleLinesHeight = 0
    let subTitleLinesHeight = 0
    if (title) {
        ctx.font = titleFont
        ctx.globalAlpha = titleAlpha

        titleLines = wrapText(ctx, title, maxTextWidth)
        titleLinesHeight = titleLines.length * titleLineHeight
    }
    if (subTitle) {
        ctx.font = subTitleFont
        ctx.globalAlpha = subTitleAlpha

        subTitleLines = wrapText(ctx, subTitle, maxTextWidth)
        subTitleLinesHeight = subTitleLines.length * subTitleLineHeight
    }
    let spaceBetween = 0
    if (title && subTitle) {
        spaceBetween = 20
    }
    const linesHeight = titleLinesHeight + subTitleLinesHeight + spaceBetween
    const titleStartY = (canvas.height - linesHeight) / 2
    const subTitleStartY = titleStartY + titleLinesHeight + spaceBetween

    drawText(ctx, titleLines, titleStartY, titleLineHeight, titleFont, titleAlpha)
    drawText(ctx, subTitleLines, subTitleStartY, subTitleLineHeight, subTitleFont, subTitleAlpha)

    res.setHeader('Content-Type', 'image/png')
    canvas.createPNGStream().pipe(res)
});

app.get('/hero-experemental', async (req, res) => {
    res.status(403).send('Access to the experimental endpoint is not authorized')
});

app.listen(port, () => {
    console.log(`Server is running`)
});

/**
 * Wraps text within a specified width and renders it on a canvas context.
 *
 * @param {CanvasRenderingContext2D} context - The canvas rendering context to draw the text on.
 * @param {string} text - The text to be wrapped and rendered.
 * @param {number} maxWidth - The maximum width of the text before wrapping.
 * @returns {string[]} An array of strings where each element represents a line of text.
 */
function wrapText(context, text, maxWidth) {
    const isCJK = char => /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(char)
    let line = ''
    let lines = []

    for (const char of text) {
        const testWidth = context.measureText(line + char).width
        const lastChar = line[line.length - 1]

        if (testWidth > maxWidth && line.length > 0) {
            if (isCJK(char)) {
                // CJK char
                lines.push(line)
                line = char
            } else {
                if (char === ' ') {
                    // space
                    lines.push(line)
                    line = ''
                } else if (line.length > 0 && (isCJK(lastChar) || lastChar === ' ')) {
                    // comes after a CJK char or space
                    lines.push(line.trim())
                    line = char
                } else {
                    // Using - as a hyphen
                    lines.push(line.slice(0, -1) + '-')
                    line = lastChar + char
                }
            }
        } else {
            line += char
        }
    }
    lines.push(line.trim())

    return lines
}

/**
 * Draws text on a canvas context.
 *
 * @param {CanvasRenderingContext2D} context - The canvas rendering context to draw the text on.
 * @param {string[]} lines - An array of strings where each element represents a line of text.
 * @param {number} startY - The y-coordinate of the start of the text.
 * @param {number} lineHeight - The height of each line of text.
 * @param {string} font - The font style to be used for the text.
 * @param {number} alpha - The transparency of the text.
 */
function drawText(context, lines, startY, lineHeight, font, alpha) {
    context.font = font
    context.globalAlpha = alpha
    lines.forEach((line, index) => {
        context.fillText(line, context.canvas.width / 2, startY + index * lineHeight + lineHeight / 2)
    })
}