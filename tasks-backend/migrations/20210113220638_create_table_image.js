
exports.up = function(knex) {
	return knex.schema.createTable('image', table => {
        table.increments('id').primary()
        table.string('desc').notNull()
        table.text('image').notNull()
    })
};

exports.down = function(knex) {
	return knex.schema.dropTable('image')
};