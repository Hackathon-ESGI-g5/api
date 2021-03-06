'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SlotSchema extends Schema {
  up () {
    this.alter('slots', (table) => {
      table.integer('number_max')
    })
  }

  down () {
    this.table('slots', (table) => {
      // reverse alternations
    })
  }
}

module.exports = SlotSchema
