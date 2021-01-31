
exports.up = function(knex) {
    return knex.schema.createTable('tasks_words_done', table => {
        table.increments('id').primary()
        table.datetime('dateDone')
        table.text('sound')
        table.integer('task_id').references('id').inTable('tasks').notNull()
        table.integer('word_id').references('id').inTable('words')
        table.integer('image_id').references('id').inTable('image')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks_words_done')
};
