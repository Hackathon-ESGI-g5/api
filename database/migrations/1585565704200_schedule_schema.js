'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleSchema extends Schema {
  up () {
    this.create('schedules', (table) => {
      table.increments()
      table.timestamp('openning_time')
      table.timestamp('closing_time')
      table.integer('shop_id').unsigned().references('id').inTable('shops')
      table.integer('status_schedule_id').unsigned().references('id').inTable('status_schedules')
      table.double('interval')
      table.timestamps()
    })
  }

  down () {
    this.drop('schedules')
  }
}

module.exports = ScheduleSchema
