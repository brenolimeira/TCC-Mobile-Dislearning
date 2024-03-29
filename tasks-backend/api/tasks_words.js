const moment = require('moment')

module.exports = app => {

    const getTasksWords = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('task_words')
            .where({ task_id: req.params.idTask })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.task_id) {
            return res.status(400).send('Task Id é um campo obrigatório!')
        }

        /* req.body.userId = req.user.id */

        app.db('task_words')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('task_words')
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

    return { getTasksWords, save, remove }
}