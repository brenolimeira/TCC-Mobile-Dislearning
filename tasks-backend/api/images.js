const sharp = require('sharp')
const fs = require('fs')

module.exports = app => {
    const getImages = (req, res) => {

        app.db('image')
            .then(images => res.json(images))
            .catch(err => res.status(400).json(err))
    }

    const getImageById = (req, res) => {

        app.db('image')
            .where({ id: req.params.id })
            .first()
            .then(images => res.json(images))
            .catch(err => res.status(400).json(err))
    }

    const update = async (req, res) => {

        const newPath = req.files[0].path.split('.')[0] + '.webp'
        const returnPath = req.files[0].filename.split('.')[0] + '.webp'

        await sharp(req.files[0].path)
            .resize({ width: 640, height: 360 })
            .toFormat('webp')
            .webp({
                quality: 60
            })
            .toBuffer()
            .then(data => {
                fs.access(req.files[0].path, cb => {
                    if (!cb) {
                        fs.unlink(req.files[0].path, cb => {
                            if (cb) console.log(cb)
                        })
                    }
                })

                fs.writeFile(newPath, data, cb => {
                    if (cb) throw cb
                })
            })

        app.db('image')
            .where({ id: req.params.id })
            .update({ desc: req.body.desc, image: returnPath })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const getImagesTaskIdt = (req, res) => {

        app.db('image')
            .join('task_images', 'image.id', '=', 'task_images.image_id')
            .where('task_images.task_id', '=', req.params.id)
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const save = async (req, res) => {
        if (!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório!')
        }

        /* const requestImages = req.files

        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        console.log(images) */

        /* fs.access(`../uploads/${req.files[0].filename}`, err => {
            if(err) {
                fs.mkdirSync('../uploads')
            }
        }) */

        const newPath = req.files[0].path.split('.')[0] + '.webp'
        const returnPath = req.files[0].filename.split('.')[0] + '.webp'

        await sharp(req.files[0].path)
            .resize({ width: 640, height: 360 })
            .toFormat('webp')
            .webp({
                quality: 60
            })
            .toBuffer()
            .then(data => {
                fs.access(req.files[0].path, cb => {
                    if (!cb) {
                        fs.unlink(req.files[0].path, cb => {
                            if (cb) console.log(cb)
                        })
                    }
                })

                fs.writeFile(newPath, data, cb => {
                    if (cb) throw cb
                })
            })

        app.db('image')
            .insert({
                desc: req.body.desc,
                image: returnPath
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))

    }

    const remove = (req, res) => {
        app.db('image')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada imagem com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const removeImage = (req, res) => {
        app.db('image')
            .where({ id: req.params.id })
            .then(async image => {
                try {
                    await fs.access(`uploads/${image[0].image}`, cb => {
                        if(!cb) {
                            fs.unlink(`uploads/${image[0].image}`, cb => {
                                if (cb) console.log(cb)
                            })
                        }
                    })
                    res.status(204).send()
                } catch(e) {
                    const msg = `Não foi encontrado imagem com esse nome ${image[0].image}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return {
        getImages,
        save,
        remove,
        update,
        getImagesTaskIdt,
        getImageById,
        removeImage
    }
}