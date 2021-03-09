
module.exports = app => {

    const getTasksUsers = (req, res) => {

        app.db('tasks_users')
            .where({ user_id: req.user.id })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTasksUserAll = (req, res) => {

        app.db('tasks_users')
            .where({ user_id: req.params.id })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.task_id && !req.body.user_id) {
            return res.status(400).send('Task Id é um campo obrigatório!')
        }

        app.db('tasks_users')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks_users')
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

    return { getTasksUsers, getTasksUserAll, save, remove }
}