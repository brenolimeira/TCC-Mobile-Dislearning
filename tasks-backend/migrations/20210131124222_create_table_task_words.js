
exports.up = function(knex) {
    return knex.schema.createTable('task_words', table => {
        table.increments('id').primary()
        table.integer('task_id').references('id').inTable('tasks').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('word_id').references('id').inTable('words').notNull().onUpdate('CASCADE').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('task_words')
};
