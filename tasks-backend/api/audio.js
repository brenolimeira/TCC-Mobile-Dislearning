const sharp = require('sharp')
const fs = require('fs')
const server = 'http://localhost:3001'

module.exports = app => {
    const getAudios = (req, res) => {

        app.db('audio')
            .then(audios => res.json(audios))
            .catch(err => res.status(400).json(err))
    }

    const getAudioById = (req, res) => {

        app.db('audio')
            .where({ id: req.params.id })
            .first()
            .then(audio => res.json(audio))
            .catch(err => res.status(400).json(err))
    }

    const update = async (req, res) => {

        app.db('audio')
            .where({ id: req.params.id })
            .update({ desc: req.body.desc, audio: req.files[0].filename })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const getAudiosTaskIdt = (req, res) => {

        app.db('audio')
            .join('task_audios', 'audio.id', '=', 'task_audios.audio_id')
            .where('task_audios.task_id', '=', req.params.id)
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if (!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório!')
        }

        app.db('audio')
            .insert({
                desc: req.body.desc,
                audio: req.files[0].filename
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))

    }

    const remove = (req, res) => {
        app.db('audio')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado audio com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const removeAudio = (req, res) => {
        app.db('audio')
            .where({ id: req.params.id })
            .then(async audio => {
                try {
                    await fs.access(`audios/${audio[0].audio}`, cb => {
                        if(!cb) {
                            fs.unlink(`audios/${audio[0].audio}`, cb => {
                                if (cb) console.log(cb)
                            })
                        }
                    })
                    res.status(204).send()
                } catch(e) {
                    const msg = `Não foi encontrado audio com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return {
        getAudios,
        save,
        remove,
        update,
        getAudiosTaskIdt,
        getAudioById,
        removeAudio
    }
}