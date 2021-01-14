
exports.up = function(knex) {
    return knex.schema.createTable('patient_task', table => {
        table.increments('id').primary()
        table.integer('taskId').references('id').inTable('tasks').notNull()
        table.integer('userId').references('id').inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('patient_task')
};
