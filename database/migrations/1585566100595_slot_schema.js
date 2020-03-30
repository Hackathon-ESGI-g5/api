'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SlotSchema extends Schema {
  up () {
    this.create('slots', (table) => {
      table.increments()
      table.integer('shop_id').unsigned().references('id').inTable('shops')
      table.timestamp('begin_at')
      table.timestamp('end_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('slots')
  }
}

module.exports = SlotSchema
