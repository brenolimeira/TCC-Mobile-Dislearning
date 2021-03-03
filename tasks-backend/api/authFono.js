const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos')
        }

        const fono = await app.db('fono')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first()

        if(fono) {
            bcrypt.compare(req.body.password, fono.password, (err, isMath) => {
                if(err || !isMath) {  
                    return res.status(401).send('A senha informada é inválida!')
                }

                const payload = { id: fono.id }
                res.json({
                    name: fono.name,
                    email: fono.email,
                    token: jwt.encode(payload, authSecret),
                })
            })
        } else {
            res.status(400).send('Fonoaudiólogo não cadastrado!')
        }
    }

    return { signin }
}