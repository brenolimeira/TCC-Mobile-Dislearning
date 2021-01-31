const multer = require('multer')
const { storage } = require('./upload')

const upload = multer({ storage: storage })

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)

    app.route('/users')
        .get(app.api.user.getUsers)

    app.route('/users/:name/name')
        .get(app.api.user.getUsersName)

    app.route('/users/:id')
        .delete(app.api.user.remove)

    app.route('/tasks')
        .post(app.api.task.save)

    app.route('/tasksUserId')
        .all(app.config.passport.authenticate())
        .get(app.api.task.getTasksUserId)

    app.route('/doneAt')
        .get(app.api.task.getTasksDoneAtUser)

    app.route('/tasksAll')
        .get(app.api.task.getTasksAll)

    app.route('/words/:id/task')
        .get(app.api.word.getWordsTaskId)

    app.route('/wordsTask/:id')
        .get(app.api.word.getWordsTaskIdt)

    app.route('/tasks')
        .all(app.config.passport.authenticate())
        .get(app.api.task.getTasks)

    app.route('/tasks/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.task.remove)

    app.route('/tasks/:id/toggle')
        .all(app.config.passport.authenticate())
        .put(app.api.task.toggleTask)

    app.route('/words')
        .post(app.api.word.save)

    app.route('/words/:taskId/count1')
        .get(app.api.word.verifyNullDoneAt)

    app.route('/words/:taskId/count2')
        .get(app.api.word.verifyNotNullDoneAt)

    //verifica a quantidade de palavras que estão com as pronúncias erradas
    app.route('/words/:taskId/wrong')
        .get(app.api.word.verifyWrong)

    //verifica a quantidade de palavras que estão com as pronúncias corretas
    app.route('/words/:taskId/correct')
        .get(app.api.word.verifyCorrect)

    /* app.route('/words')
        .all(app.config.passport.authenticate())
        .get(app.api.word.getWords) */

    app.route('/wordsAll')
        .get(app.api.word.getWords)

    app.route('/words/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.word.remove)

    app.route('/words/:id/:taskId/toggle')
        .all(app.config.passport.authenticate())
        .put(app.api.word.toggleWord)

    app.route('/words/:id/:equalsWords/:taskId/toggle')
        .all(app.config.passport.authenticate())
        .put(app.api.word.toggleWordEquals)

    app.route('/task-words/:idTask')
        .get(app.api.tasks_words.getTasksWords)

    app.route('/task-words/:idTask/save')
        .post(app.api.tasks_words.save)

    app.route('/images-all')
        .get(app.api.images.getImages)

    app.route('/processes-all')
        .get(app.api.processes.getProcesses)

    app.route('/processe-save')
        .post(app.api.processes.save)

    app.route('/save-image')
        .post(upload.array('image'), app.api.images.save)

    /* app.route('/words/:taskId/verifyNull')
        .all(app.config.passport.authenticate())
        .get(app.api.word.verifyNullDoneAt) */

}