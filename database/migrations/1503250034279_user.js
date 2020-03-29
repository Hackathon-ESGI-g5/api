'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.varchar('account_status', 255)
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('firstname', 255).notNullable()
      table.string('lastname', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
