
exports.up = function(knex) {
    return knex.schema.createTable('task_images', table => {
        table.increments('id').primary()
        table.integer('task_id').references('id').inTable('tasks').notNull()
        table.integer('image_id').references('id').inTable('image').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('task_images')
};

