
module.exports = app => {
    const getImages = (req, res) => {

        app.db('images')
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    }

    /* const getImagesTaskIdt = (req, res) => {

        app.db('words')
            .join('task_words', 'words.id', '=', 'task_words.word_id')
            .where('task_words.task_id', '=', req.params.id)
            .then(words => res.json(words))
            .catch(err => res.status(400).json(err))
    } */

    const save = (req, res) => {
        if(!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório!')
        }

        app.db('images')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('images')
            .where({ id: req.params.id })
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

    return { getImages, 
            save, 
            remove }
}