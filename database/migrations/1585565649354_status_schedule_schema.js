'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatusScheduleSchema extends Schema {
  up () {
    this.create('status_schedules', (table) => {
      table.increments()
      table.string('label', 245)
      table.text('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('status_schedules')
  }
}

module.exports = StatusScheduleSchema
