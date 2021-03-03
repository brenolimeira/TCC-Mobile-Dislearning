const moment = require('moment')

module.exports = app => {

    const getMessagesFono = (req, res) => {

        app.db('messages')
            .where({ fono_id: req.user.id, user_id: req.params.patient_id })
            .orderBy('createAt')
            .then(messages => res.json(messages))
            .catch(err => res.status(400).json(err))
    }

    const getMessagesPatient = (req, res) => {

        app.db('messages')
            .where({ fono_id: req.params.fono_id, user_id: req.user.id }) 
            .orderBy('createAt')
            .then(messages => res.json(messages))
            .catch(err => res.status(400).json(err))
    }

    const saveMsgFono = (req, res) => {
        if(!req.body.text.trim()) {
            return res.status(400).send('Nome é um campo obrigatório!')
        }

        app.db('messages')
            .insert({
                createAt: req.body.createAt,
                text: req.body.text,
                user_id: req.body.patient_id,
                fono_id: req.user.id
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const saveMsgPatient = (req, res) => {
        if(!req.body.text.trim()) {
            return res.status(400).send('Nome é um campo obrigatório!')
        }

        app.db('messages')
            .insert({
                createAt: req.body.createAt,
                text: req.body.text,
                user_id: req.user.id,
                fono_id: req.body.fono_id
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('messages')
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

    return { saveMsgFono, remove, saveMsgPatient, getMessagesFono, getMessagesPatient }
}