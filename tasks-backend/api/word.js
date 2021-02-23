const moment = require('moment')

module.exports = app => {
    const getWords = (req, res) => {

        app.db('words')
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const getWordById = (req, res) => {

        app.db('words')
            .where({ id: req.params.id })
            .first()
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const getWordsTaskId = (req, res) => {

        app.db('words')
            .where({ id: req.params.id })
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const getWordsTaskIdt = (req, res) => {

        app.db('words')
            .join('task_words', 'words.id', '=', 'task_words.word_id')
            .where('task_words.task_id', '=', req.params.id)
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    // colocar id do paciente também, tanto no método quanto no bd
    const getCountWordDone = (req, res) => {

        /* var totalCount = await getmodel().clone().count()
        var data = await getmodel().clone()
        return {
            totalCount: totalCount[0]['count'],
            data: data
        } */

        app.db('words')
            .join('tasks_words_done', 'words.id', '=', 'tasks_words_done.word_id')
            .where('tasks_words_done.word_id', '=', req.params.word_id)
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const getCountTest = (req, res) => {
        app.db('words')
            .join('task_words', 'task_words.word_id', 'words.id')
            .leftJoin('tasks_words_done', 'tasks_words_done.word_id', 'words.id')
            .where('task_words.task_id', '=', req.params.id)
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    const update = (req, res, word) => {
        if(!req.body.word.trim()) {
            return res.status(400).send('Palavra é um campo obrigatório!')
        }

        app.db('words')
            .where({ id: req.params.id })
            .update({ word: req.body.word })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.word.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório!')
        }

        app.db('words')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('words')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if(rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada palavra com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { getWords, 
            save, 
            remove, 
            update, 
            getWordsTaskId, 
            getWordsTaskIdt, 
            getCountWordDone,
            getCountTest, 
            getWordById }
}
/* const moment = require('moment')

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
} */