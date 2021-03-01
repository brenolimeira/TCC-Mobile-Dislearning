
exports.up = function(knex) {
	return knex.schema.createTable('audio', table => {
        table.increments('id').primary()
        table.string('desc').notNull()
        table.text('audio').notNull()
    })
};

exports.down = function(knex) {
	return knex.schema.dropTable('audio')
};