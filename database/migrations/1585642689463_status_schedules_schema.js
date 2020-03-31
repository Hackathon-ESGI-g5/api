'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatusSchedulesSchema extends Schema {
  up () {
    //this.drop('status_schedules')
  }

  down () {
    this.table('status_schedules', (table) => {
      // reverse alternations
    })
  }
}

module.exports = StatusSchedulesSchema
