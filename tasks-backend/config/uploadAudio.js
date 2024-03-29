const { request } = require('http')
const multer = require('multer')
const path = require('path')

const storageAudio = multer.diskStorage({
    destination: path.join(__dirname, '..', 'audios'),
    filename: (request, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

module.exports = { storageAudio };