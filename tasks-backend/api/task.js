const moment = require('moment')

module.exports = app => {

    const getTasks = (req, res) => {
        /* const date = req.query.date ? req.query.date : moment().endOf('day').toDate() */

        app.db('tasks')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTasksAll = (req, res) => {
        app.db('tasks')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTaskById = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id })
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTasksUserFono = (req, res) => {
        app.db('tasks')
            .join('tasks_users', 'tasks.id', '=', 'tasks_users.task_id')
            .where('tasks_users.user_id', '=', req.params.id)
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const getTasksUserId = (req, res) => {
        const date = moment().endOf('day').toDate()

        console.log()

        app.db('tasks')
            //.where({ userId: req.user.id, estimateAt: date }) adicionar essa linha no final
            .where({ userId: req.user.id }) //retirar essa linha
            .where('endDate', '>=', date) //retirar essa linha
            /* .orderBy('endDate') */
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTasksProcesseId = (req, res) => {

        app.db('tasks')
            .where({ processes_id: req.params.processeId}) //retirar essa linha
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTaskProcesse = (req, res) => {

        app.db('tasks')
            .distinct('tasks.id as id','tasks.name as name', 'tasks.desc as desc', 'processes.name as name_processe')
            .join('processes', 'tasks.processes_id', '=', 'processes.id')
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }


    const getTasksDoneAtUser = (req, res) => {

        app.db('tasks')
            .whereNotNull('doneAt')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.name.trim()) {
            return res.status(400).send('Nome é um campo obrigatório!')
        }

        /* req.body.userId = req.user.id */

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then(rowsDeleted => {
                if(rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada task com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if(!task) {
                    const msg = `Task com id ${req.params.id} não encontrada`
                    return res.status(400).send(msg)
                }

                const doneAt = new Date()
                updateTaskDoneAt(req, res, doneAt)
            })
            .catch(err => res.status(400).json(err))
    }

    return { getTasks, save, remove, toggleTask, getTasksUserId, getTasksDoneAtUser, 
        getTasksAll, getTasksProcesseId, getTaskById, getTasksUserFono, getTaskProcesse }
}
/* const moment = require('moment')

module.exports = app => {

    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date : moment().endOf('day').toDate()

        app.db('tasks')
            //.where({ userId: req.user.id, estimateAt: date }) adicionar essa linha no final
            .where({ userId: req.user.id }) //retirar essa linha
            .where('estimateAt', '<=', date) //retirar essa linha
            .orderBy('estimateAt')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTasksAll = (req, res) => {
        app.db('tasks')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTasksUserId = (req, res) => {
        const date = req.query.date ? req.query.date : moment().endOf('day').toDate()

        app.db('tasks')
            //.where({ userId: req.user.id, estimateAt: date }) adicionar essa linha no final
            .where({ userId: req.params.id }) //retirar essa linha
            .where('estimateAt', '<=', date) //retirar essa linha
            .orderBy('estimateAt')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const getTasksDoneAtUser = (req, res) => {

        app.db('tasks')
            .whereNotNull('doneAt')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório!')
        }

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then(rowsDeleted => {
                if(rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada task com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if(!task) {
                    const msg = `Task com id ${req.params.id} não encontrada`
                    return res.status(400).send(msg)
                }

                const doneAt = new Date()
                updateTaskDoneAt(req, res, doneAt)
            })
            .catch(err => res.status(400).json(err))
    }

    return { getTasks, save, remove, toggleTask, getTasksUserId, getTasksDoneAtUser, getTasksAll }
} */