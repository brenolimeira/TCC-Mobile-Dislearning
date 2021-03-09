const moment = require('moment')

module.exports = app => {

    const getTasksImages = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('task_audios')
            .where({ task_id: req.params.idTask })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {

        app.db('task_audios')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('task_audios')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if(rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada tasks_images com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { getTasksImages, save, remove }
}