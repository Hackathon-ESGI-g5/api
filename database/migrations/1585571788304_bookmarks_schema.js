'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookmarksSchema extends Schema {
  up () {
    this.create('bookmarks', (table) => {
      table.integer('shop_id').unsigned().references('id').inTable('shops')
      table.integer('user_id').unsigned().references('id').inTable('users')
    })
  }

  down () {
    this.drop('bookmarks')
  }
}

module.exports = BookmarksSchema
