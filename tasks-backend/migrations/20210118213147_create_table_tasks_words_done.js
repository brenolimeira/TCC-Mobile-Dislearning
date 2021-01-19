
exports.up = function(knex) {
    return knex.schema.createTable('tasks_words_done', table => {
        table.increments('id').primary()
        table.datetime('dateDone')
        table.text('sound')
        table.integer('taskId').references('id').inTable('tasks').notNull()
        table.integer('wordId').references('id').inTable('words')
        table.integer('imageId').references('id').inTable('image')
    })
};

exports.down = function(knex) {
  
};
