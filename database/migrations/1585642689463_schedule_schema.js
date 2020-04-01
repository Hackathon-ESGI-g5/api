'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleSchema extends Schema {
  up () {
    this.alter('schedules', (table) => {
      table.dropForeign('status_schedule_id')
      table.dropColumn('status_schedule_id')
      table.boolean('isopen')
      table.integer('number_max')
    })
  }

  down () {
    this.table('schedules', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ScheduleSchema
