
exports.up = function(knex) {
    return knex.schema.createTable('tasks_words_done', table => {
        table.increments('id').primary()
        table.datetime('dateDone')
        table.text('sound')
        table.string('formEvaluation')
        table.string('pcc')
        table.integer('task_id').references('id').inTable('tasks').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('user_id').references('id').inTable('users').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('word_id').references('id').inTable('words').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('image_id').references('id').inTable('image').onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('audio_id').references('id').inTable('audio').onUpdate('CASCADE').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks_words_done')
};
