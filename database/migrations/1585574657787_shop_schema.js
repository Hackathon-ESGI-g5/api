'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShopSchema extends Schema {
  up () {
    this.alter('shops', (table) => {
      table.string('profile_picture_url', 254)
    })
  }

  down () {
    this.table('shops', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ShopSchema
