'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleSchema extends Schema {
  up () {
    this.alter('schedules', (table) => {
      table.dropColumn('openning_time')
      table.dropColumn('closing_time')
      table.string('open_hour')
      table.string('close_hour')
      table.integer('day')
    })
  }

  down () {
    this.table('schedules', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ScheduleSchema
