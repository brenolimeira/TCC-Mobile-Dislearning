
exports.up = function(knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary()
        table.string('desc').notNull()
        table.datetime('startDate')
        table.datetime('endDate')
        table.integer('days')
        table.integer('week')
        table.integer('daysAll')
        table.integer('weekAll')
        table.boolean('done')
        table.integer('userId').references('id').inTable('users').notNull()
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