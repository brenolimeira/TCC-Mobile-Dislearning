
module.exports = app => {

    const getTasksWordsDone = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('tasks_words_done')
            .where({ task_id: req.params.taskId, word_id: req.params.wordId })
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

    const getTasksImagesDone = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('tasks_words_done')
            .where({ task_id: req.params.taskId, image_id: req.params.imageId })
            .then(task_words_done => res.json(task_words_done))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.task_id) {
            return res.status(400).send('Task Id é um campo obrigatório!')
        }

        /* req.body.userId = req.user.id */

        app.db('tasks_words_done')
            .insert(req.body)
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

    return { getTasksWordsDone, save, remove, getTasksImagesDone, getWordsId }
}