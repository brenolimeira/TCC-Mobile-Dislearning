const { request } = require('http')
const multer = require('multer')
const path = require('path')

/* import sharp from 'sharp';
import fs from 'fs'; */

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (request, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

module.exports = { storage };