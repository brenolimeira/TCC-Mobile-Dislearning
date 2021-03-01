const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const path = require('path')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors({
        origin: '*'
    }))
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
    app.use('/audios', express.static(path.join(__dirname, '..', 'audios')))
}