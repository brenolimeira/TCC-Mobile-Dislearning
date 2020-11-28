
exports.up = function(knex) {
	return knex.schema.createTable('words', table => {
        table.increments('id').primary()
        table.string('desc').notNull()
        table.datetime('estimateAt')
		table.datetime('doneAt')
        table.text('image')
        table.string('equalsWords')
        table.integer('taskId').references('id').inTable('tasks').notNull()
    })
};

exports.down = function(knex) {
	return knex.schema.dropTable('words')
};
