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

            app.db('fono').insert({ name: req.body.name, email: req.body.email, password })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json())
        })
    }

    const remove = (req, res) => {
        app.db('fono')
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

    const getFonos = (req, res) => {
        app.db('fono')
            .orderBy('name')
            .then(users => res.json(users))
            .catch(err => res.status(400).json(err))
    }

    const getFonosName = (req, res) => {
        app.db('fono')
            .where('name', 'ilike', `%${req.params.name}%`)
            .then(users => res.json(users))
            .catch(err => res.status(400).json(err))
    }

    return { save, getFonos, getFonosName, remove }
}