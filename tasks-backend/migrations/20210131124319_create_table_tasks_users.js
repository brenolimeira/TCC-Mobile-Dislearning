
exports.up = function(knex) {
    return knex.schema.createTable('tasks_users', table => {
        table.increments('id').primary()
        table.datetime('startDate')
        table.datetime('endDate')
        table.integer('daysAll')
        table.integer('weekAll')
        table.boolean('done')
        table.integer('user_id').references('id').inTable('users').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('task_id').references('id').inTable('tasks').notNull().onUpdate('CASCADE').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks_users')
};
