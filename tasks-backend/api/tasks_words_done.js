
const moment = require('moment')

module.exports = app => {

    const getTasksWordsDone = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */


        app.db('tasks_words_done')
            .where({ task_id: req.params.taskId, word_id: req.params.wordId, user_id: req.user.id })
            .andWhere('date_done', '>=', moment().startOf('day'))
            .andWhere('date_done', '<=', moment().endOf('day'))
            .then(task_words_done => res.json(task_words_done))
            .catch(err => res.status(400).json(err))
    }

    const getWordsId = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('tasks_words_done')
            .where({ id: req.params.id })
            .first()
            .then(task_words_done => res.json(task_words_done))
            .catch(err => res.status(400).json(err))
    }

    const getResourcesAllDone = (req, res) => {

        app.db('tasks_words_done')
            .then(task_words_done => res.json(task_words_done))
            .catch(err => res.status(400).json(err))
    }

    const getTasksImagesDone = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('tasks_words_done')
            .where({ task_id: req.params.taskId, image_id: req.params.imageId, user_id: req.user.id })
            .then(task_words_done => res.json(task_words_done))
            .catch(err => res.status(400).json(err))
    }

    const getTasksAudiosDone = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('tasks_words_done')
            .where({ task_id: req.params.taskId, audio_id: req.params.audio_id, user_id: req.user.id })
            .then(task_words_done => res.json(task_words_done))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.task_id) {
            return res.status(400).send('Task Id é um campo obrigatório!')
        }

        /* req.body.userId = req.user.id */

        if(req.body.word_id) {
            app.db('tasks_words_done')
                .insert({
                    date_done: req.body.date_done,
                    sound: req.body.sound,
                    task_id: req.body.task_id,
                    word_id: req.body.word_id,
                    user_id: req.user.id
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))
        } else {
            app.db('tasks_words_done')
            .insert({
                date_done: req.body.date_done,
                sound: req.body.sound,
                task_id: req.body.task_id,
                image_id: req.body.image_id,
                user_id: req.user.id
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
        }

    }

    const update = (req, res) => {

        app.db('tasks_words_done')
            .where({ user_id: req.params.user_id, word_id: req.params.word_id, date_done: req.params.date_done })
            .update({ formEvaluation: req.body.formEvolution, pcc: req.body.pcc })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const updateImage = (req, res) => {

        app.db('tasks_words_done')
            .where({ user_id: req.params.user_id, image_id: req.params.image_id, date_done: req.params.date_done })
            .update({ formEvaluation: req.body.formEvolution, pcc: req.body.pcc })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const updateAudio = (req, res) => {

        app.db('tasks_words_done')
            .where({ user_id: req.params.user_id, audio_id: req.params.audio_id, date_done: req.params.date_done })
            .update({ formEvaluation: req.body.formEvolution, pcc: req.body.pcc })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks_words_done')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if(rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada task_words com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { getTasksWordsDone, save, update, updateImage, updateAudio,
        remove, getTasksImagesDone, getTasksAudiosDone, getWordsId, getResourcesAllDone }
}