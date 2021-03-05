const app = require('express')()
const db = require('./config/db')
const consign = require('consign')
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = db

const emitMessages = (fono_id, user_id) => {

    app.api.messages.getMessagesFonoSocket(fono_id, user_id)
        .then(result => io.emit("chat messages", result))
        .catch(console.log)
}

io.on("connection", socket => {

    socket.on("chat messages", msg => {

        app.api.messages.saveMsgFonoSocket(msg)
            .then(_ => {
                emitMessages(msg.fono_id, msg.patient_id)
            })
            .catch(err => io.emit(err))

    })

    socket.on("disconnect", () => {
        console.log("usuário desconectado");
    })
})

/* const getMessagesFonoSocket = (req, res) => {

    app.db('messages')
        .where({ fono_id: req.user.id, user_id: req.params.patient_id })
        .orderBy('createdAt')
        .then(messages => io.emit("chat messages", messages))
        .catch(err => res.status(400).json(err))
}

const saveMsgFonoSocket = (message) => {
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

io.on("connection", socket => {
    console.log('usuário conectado')

    socket.on("chat messages", msg => {

    })
}) */

//talvez não use \/
/* io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    const { idPatient } = socket.handshake.query

    socket.on("chat message", msg => {
        console.log(msg)
        io.in(idPatient).emit("chat message", msg)
    })

    socket.on("disconnect", () => {
        socket.leave(idPatient);
    })
}) */

server.listen(3001, () => {
    console.log('Backend executando...')
})