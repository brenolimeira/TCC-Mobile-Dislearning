
exports.up = function(knex) {
    return knex.schema.createTable('task_images', table => {
        table.increments('id').primary()
        table.integer('taskId').references('id').inTable('tasks').notNull()
        table.integer('imageId').references('id').inTable('image').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('task_images')
};

