'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShopSchema extends Schema {
  up () {
    this.table('shops', (table) => {
      table.float('lat');
      table.float('lng');
    })
  }

  down () {
    this.table('shops', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ShopSchema
