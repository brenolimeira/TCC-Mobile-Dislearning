
exports.up = function(knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('desc').notNull()
        table.integer('processes_id').references('id').inTable('processes').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        /* table.integer('processesId').references('id').inTable('processes').notNull() */
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks')
};

/* exports.up = function(knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary()
        table.string('desc').notNull()
        table.datetime('estimateAt')
        table.datetime('doneAt')
        table.integer('userId').references('id').inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks')
};
 */