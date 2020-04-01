'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShopSchema extends Schema {
  up () {
    this.alter('shops', (table) => {
      table.string('siret', 255);
      table.string('siren', 255);
      table.string('activity', 255);
      table.string('path_to_validation_shop', 255);
      table.string('path_to_validation_owner', 255);
      table.boolean('is_validate');
    })
  }

  down () {
    this.table('shops', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ShopSchema
