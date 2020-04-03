'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookmarkSchema extends Schema {
  up () {
    this.table('bookmarks', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.table('bookmarks', (table) => {
      // reverse alternations
    })
  }
}

module.exports = BookmarkSchema
