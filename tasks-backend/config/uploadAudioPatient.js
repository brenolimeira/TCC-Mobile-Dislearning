const { request } = require('http')
const multer = require('multer')
const path = require('path')

const storageAudioPatient = multer.diskStorage({
    destination: path.join(__dirname, '..', 'audios-patients'),
    filename: (request, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

module.exports = { storageAudioPatient };