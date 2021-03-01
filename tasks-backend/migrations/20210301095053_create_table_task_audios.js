
exports.up = function(knex) {
    return knex.schema.createTable('task_audios', table => {
        table.increments('id').primary()
        table.integer('task_id').references('id').inTable('tasks').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('audio_id').references('id').inTable('audio').notNull().onUpdate('CASCADE').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('task_audios')
};

