const moment = require('moment')

module.exports = app => {
    const getWords = (req, res) => {
        const date = req.query.date ? req.query.date : moment().endOf('day').toDate()

        app.db('words')
            .where({ taskId: req.query.taskId })
            .where('estimateAt', '>=', date)
            .orderBy('estimateAt')
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const getWordsTaskId = (req, res) => {

        app.db('words')
            .where({ taskId: req.params.id })
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório!')
        }

        app.db('words')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('words')
            .where({ id: req.params.id, taskId: req.task.id })
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

    const updateWordDoneAt = (req, res, doneAt) => {
        app.db('words')
            .where({ id: req.params.id, taskId: req.params.taskId })
            .update({ doneAt })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleWord = (req, res) => {
        app.db('words')
            .where({ id: req.params.id, taskId: req.params.taskId })
            .first()
            .then(word => {
                if(!word) {
                    const msg = `Palavra com id ${req.params.id} não encontrada`
                    return res.status(400).send(msg)
                }

                const doneAt = word.doneAt ? null : new Date()
                updateWordDoneAt(req, res, doneAt)
            })
            .catch(err => res.status(400).json(err))
    }

    const updateWordEquals = (req, res, equalsWords) => {
        app.db('words')
            .where({ id: req.params.id, taskId: req.params.taskId })
            .update({ equalsWords })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleWordEquals = (req, res) => {
        app.db('words')
            .where({ id: req.params.id, taskId: req.params.taskId })
            .first()
            .then(word => {
                if(!word) {
                    const msg = `Palavra com id ${req.params.id} não encontrada`
                    return res.status(400).send(msg)
                }

                const equalsWords = req.params.equalsWords
                updateWordEquals(req, res, equalsWords)
            })
            .catch(err => res.status(400).json(err))
    }

    const verifyNullDoneAt = (req, res) => {
        app.db('words')
            .where({ taskId: req.params.taskId })
            .whereNull('doneAt')
            .then(word => {
                if(!word) {
                    const msg = `Task com id ${req.params.taskId} não encontrada`
                    return res.status(400).send(msg)
                } else {
                    return res.json(word)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const verifyNotNullDoneAt = (req, res) => {
        app.db('words')
            .where({ taskId: req.params.taskId })
            .whereNotNull('doneAt')
            .then(word => {
                if(!word) {
                    const msg = `Task com id ${req.params.taskId} não encontrada`
                    return res.status(400).send(msg)
                } else {
                    return res.json(word)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const verifyWrong = (req, res) => {
        app.db('words')
            .where({ taskId: req.params.taskId, equalsWords: 'wrong' })
            .whereNotNull('doneAt')
            .then(word => {
                if(!word) {
                    const msg = `Task com id ${req.params.taskId} não encontrada`
                    return res.status(400).send(msg)
                } else {
                    return res.json(word)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const verifyCorrect = (req, res) => {
        app.db('words')
            .where({ taskId: req.params.taskId, equalsWords: 'correct' })
            .whereNotNull('doneAt')
            .then(word => {
                if(!word) {
                    const msg = `Task com id ${req.params.taskId} não encontrada`
                    return res.status(400).send(msg)
                } else {
                    return res.json(word)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { getWords, 
            save, 
            remove, 
            toggleWord, 
            toggleWordEquals, 
            verifyNullDoneAt, 
            getWordsTaskId, 
            verifyNotNullDoneAt,
            verifyWrong,
            verifyCorrect }
}