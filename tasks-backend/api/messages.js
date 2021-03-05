
module.exports = app => {

    const getMessagesFono = (req, res) => {

        app.db('messages')
            .where({ fono_id: req.user.id, user_id: req.params.patient_id })
            .orderBy('createdAt')
            .then(messages => res.json(messages))
            .catch(err => res.status(400).json(err))
    }

    const getMessagesFonoSocket = (fono_id, user_id) => {

        return new Promise(resolve => {
            app.db('messages')
                .where({ fono_id: fono_id, user_id: user_id })
                .orderBy('createdAt')
                .then(messages => resolve(messages))
                .catch(err => res.status(400).json(err))
        })

    }

    const saveMsgFonoSocket = (messages) => {

        return new Promise(resolve => {
            app.db('messages')
                .insert({
                    createdAt: messages.createdAt,
                    text: messages.text,
                    type_sender: messages.type_sender,
                    user_id: messages.patient_id,
                    fono_id: messages.fono_id
                })
                .then(result => resolve(result))
                .catch(err => res.status(400).json(err))
        })

    }

    const getMessagesPatient = (req, res) => {

        app.db('messages')
            .where({ user_id: req.user.id }) 
            .orderBy('createdAt')
            .then(messages => res.json(messages))
            .catch(err => res.status(400).json(err))
    }

    const saveMsgFono = (req, res) => {
        if(!req.body.text.trim()) {
            return res.status(400).send('Nome é um campo obrigatório!')
        }

        app.db('messages')
            .insert({
                createdAt: req.body.createdAt,
                text: req.body.text,
                type_sender: req.body.type_sender,
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
                createdAt: req.body.createAt,
                text: req.body.text,
                type_sender: req.body.type_sender,
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

    return { saveMsgFono, remove, saveMsgPatient, getMessagesFono, getMessagesPatient, getMessagesFonoSocket, saveMsgFonoSocket }
}