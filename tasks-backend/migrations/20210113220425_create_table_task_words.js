
exports.up = function(knex) {
    return knex.schema.createTable('task_words', table => {
        table.increments('id').primary()
        table.integer('taskId').references('id').inTable('tasks').notNull()
        table.integer('wordId').references('id').inTable('words').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('task_words')
};
