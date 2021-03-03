
exports.up = function(knex) {
    return knex.schema.createTable('messages', table => {
        table.increments('id').primary()
        table.datetime('createdAt')
        table.text('text').notNull()
        table.string('type_sender').notNull()
        table.integer('fono_id').references('id').inTable('fono').notNull().onUpdate('CASCADE').onDelete('CASCADE')
        table.integer('user_id').references('id').inTable('users').notNull().onUpdate('CASCADE').onDelete('CASCADE')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('messages')
};

