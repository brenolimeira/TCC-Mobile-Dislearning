const multer = require('multer')
const { storage } = require('./upload')
const { storageAudio } = require('./uploadAudio')
const { storageAudioPatient } = require('./uploadAudioPatient')

const upload = multer({ storage: storage })
const uploadAudio = multer({ storage: storageAudio })
const uploadAudioPatient = multer({ storage: storageAudioPatient })

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)

    app.post('/signin-fono', app.api.authFono.signin)

    app.route('/users')
        .get(app.api.user.getUsers)

    app.route('/user-by-id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getUserById)

    app.route('/user-for-task/:id')
        .get(app.api.user.getUserByIdNotLogged)

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

    app.route('/task-processe')
        .get(app.api.task.getTaskProcesse)

    app.route('/tasksAll')
        .get(app.api.task.getTasksAll)
    
    app.route('/tasks-processe/:processeId')
        .get(app.api.task.getTasksProcesseId)

    app.route('/task-id/:id')
        .get(app.api.task.getTaskById)

    app.route('/words/:id/task')
        .get(app.api.word.getWordsTaskId)

    app.route('/wordsTask/:id')
        .get(app.api.word.getWordsTaskIdt)

    app.route('/audio-task-user/:id')
        .get(app.api.audio.getAudiosTaskIdt)

    app.route('/word-by-id/:id')
        .get(app.api.word.getWordById)

    app.route('/word-set/:id')
        .put(app.api.word.update)

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

    app.route('/wordsDone/:id/done/:word_id')
        .get(app.api.word.getCountWordDone)

    app.route('/word-done-all/:user_id/done/:word_id')
        .get(app.api.word.getCountWordDoneAll)

    app.route('/image-done-all/:user_id/done/:image_id')
        .get(app.api.images.getCountImageDoneAll)

    app.route('/image-done-all/:user_id/done/:image_id')
        .get(app.api.audio.getCountAudioDoneAll)

    app.route('/word-done-rated/:user_id/done/:word_id')
        .get(app.api.word.getCountWordDoneUser)

    app.route('/word-done-count/:id')
        .get(app.api.word.getCountTest)

    /* app.route('/words')
        .all(app.config.passport.authenticate())
        .get(app.api.word.getWords) */

    app.route('/wordsAll')
        .get(app.api.word.getWords)

    app.route('/words/:id')
        /* .all(app.config.passport.authenticate()) */
        .delete(app.api.word.remove)

    app.route('/task-words/:idTask')
        .get(app.api.tasks_words.getTasksWords)

    app.route('/task-words/:idTask/save')
        .post(app.api.tasks_words.save)

    app.route('/images-all')
        .get(app.api.images.getImages)

    app.route('/image-delete/:id')
        .delete(app.api.images.remove)

    app.route('/image-by-id/:id')
        .get(app.api.images.getImageById)

    app.route('/image-edit/:id')
        .put(upload.array('image'), app.api.images.update)

    app.route('/processes-all')
        .get(app.api.processes.getProcesses)

    app.route('/processe-save')
        .post(app.api.processes.save)

    app.route('/save-image')
        .post(upload.array('image'), app.api.images.save)

    app.route('/images-task/:id')
        .get(app.api.images.getImagesTaskIdt)

    app.route('/images-delete-file/:id')
        .delete(app.api.images.removeImage)

    app.route('/task-images/:idTask/save')
        .post(app.api.tasks_images.save)

    app.route('/task-audios/:idTask/save')
        .post(app.api.tasks_audios.save)

    app.route('/task-user')
        .post(app.api.tasks_users.save)

    app.route('/task-search-user')
        .all(app.config.passport.authenticate())
        .get(app.api.tasks_users.getTasksUsers)

    app.route('/tasks-user-id/:id')
        .get(app.api.tasks_users.getTasksUserAll)

    app.route('/tasks-user-fono/:id')
        .get(app.api.task.getTasksUserFono)

    app.route('/task-words-done/:taskId/word/:wordId')
        .get(app.api.tasks_words_done.getTasksWordsDone)

    app.route('/task-words-done/:taskId/image/:imageId')
        .get(app.api.tasks_words_done.getTasksImagesDone)

    app.route('/task-words-done/:taskId/audio/:audio_id')
        .get(app.api.tasks_words_done.getTasksAudiosDone)

    app.route('/task-word-by-id/:id')
        .get(app.api.tasks_words_done.getWordsId)

    app.route('/done-update/:user_id/:word_id/:date_done')
        .put(app.api.tasks_words_done.update)

    app.route('/done-update-image/:user_id/:image_id/:date_done')
        .put(app.api.tasks_words_done.updateImage)

    app.route('/done-update-image/:user_id/:audio_id/:date_done')
        .put(app.api.tasks_words_done.updateAudio)

    app.route('/tasks-resources-all')
        .get(app.api.tasks_words_done.getResourcesAllDone)

    app.route('/save-done-sound')
        .all(app.config.passport.authenticate())
        .post(app.api.tasks_words_done.save)

    app.route('/save-audio')
        .post(uploadAudio.array('audio') ,app.api.audio.save)

    app.route('/audios-all')
        .get(app.api.audio.getAudios)

    app.route('/audio-delete/:id')
        .delete(app.api.audio.remove)
        
    app.route('/audio-delete-file/:id')
        .delete(app.api.audio.removeAudio)

    app.route('/messages-fono/:patient_id')
        .all(app.config.passport.authenticate())
        .get(app.api.messages.getMessagesFono)

    app.route('/messages-patient')
        .all(app.config.passport.authenticate())
        .get(app.api.messages.getMessagesPatient)

    app.route('/message-send-fono')
        .all(app.config.passport.authenticate())
        .post(app.api.messages.saveMsgFono)

    app.route('/message-send-patient')
        .all(app.config.passport.authenticate())
        .post(app.api.messages.saveMsgPatient)

    app.route('/fono-by-id')
        .all(app.config.passport.authenticate())
        .get(app.api.fono.getFonoById)

}