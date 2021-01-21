const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = (req, res) => {
        obterHash(req.body.password, hash => {
            const password = hash

            app.db('users').insert({ name: req.body.name, email: req.body.email, password, description: req.body.description })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json())
        })
    }

    const remove = (req, res) => {
        app.db('users')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if(rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado usuário com id ${req.params.id}`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const getUsers = (req, res) => {
        app.db('users')
            .orderBy('name')
            .then(users => res.json(users))
            .catch(err => res.status(400).json(err))
    }

    /* const getUsersId = (req, res) => {
        app.db('users')
            .where({ id: req.params.id })
            .then(users => res.json(users))
            .catch(err => res.status(400).json(err))
    } */

    const getUsersName = (req, res) => {
        app.db('users')
            .where('name', 'ilike', `%${req.params.name}%`)
            .then(users => res.json(users))
            .catch(err => res.status(400).json(err))
    }

    return { save, getUsers, getUsersName, remove }
}