const Jimp = require('jimp');
const path = require('path');

const imagePath = path.join(__dirname, 'src', 'assets', 'captain.png');
const outputPath = path.join(__dirname, 'src', 'assets', 'captain_clean.png');

Jimp.read(imagePath)
    .then(image => {
        const { width, height } = image.bitmap;

        // We'll scan for the checkerboard colors. 
        // Usually white (#FFFFFF) and light grey (#CCCCCC or #C0C0C0).
        // Actually, sometimes it's #FFFFFF and #EFEFEF.

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const color = image.getPixelColor(x, y);
                const rgba = Jimp.intToRGBA(color);

                // Helper to check if pixel is "white-ish" or "grey-ish"
                const isWhite = rgba.r > 240 && rgba.g > 240 && rgba.b > 240;
                const isGrey = (rgba.r > 190 && rgba.r < 235) &&
                    (Math.abs(rgba.r - rgba.g) < 10) &&
                    (Math.abs(rgba.g - rgba.b) < 10);

                if (isWhite || isGrey) {
                    image.setPixelColor(0x00000000, x, y); // Set to transparent
                }
            }
        }

        return image.writeAsync(outputPath);
    })
    .then(() => {
        console.log('Successfully cleaned captain image!');
    })
    .catch(err => {
        console.error('Error cleaning image:', err);
    });
