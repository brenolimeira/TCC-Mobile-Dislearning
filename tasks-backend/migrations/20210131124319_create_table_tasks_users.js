
exports.up = function(knex) {
    return knex.schema.createTable('tasks_users', table => {
        table.increments('id').primary()
        table.datetime('startDate')
        table.datetime('endDate')
        table.integer('daysAll')
        table.integer('weekAll')
        table.boolean('done')
        table.integer('userId').references('id').inTable('users').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('taskId').references('id').inTable('tasks').notNull().onUpdate('CASCADE').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks_users')
};
