'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleSchema extends Schema {
  up () {
    this.alter('schedules', (table) => {
      table.dropForeign('status_schedule_id')
      table.dropColum('status_schedule_id')
      table.boolean('isopen')
      table.integer('number_max')
    })
    this.drop('status_schedules')
  }

  down () {
    this.table('schedules', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ScheduleSchema
