
exports.up = function(knex) {
    return knex.schema.createTable('processes', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('desc')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('processes')
};