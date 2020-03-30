'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShopSchema extends Schema {
  up () {
    this.create('shops', (table) => {
      table.increments()
      table.string('label', 245)
      table.string('address', 245)
      table.string('zip_code', 245)
      table.string('city', 245)
      table.string('phone_number', 245)
      table.string('email', 245)
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('shops')
  }
}

module.exports = ShopSchema
