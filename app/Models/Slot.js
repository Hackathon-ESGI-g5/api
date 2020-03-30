'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Slot extends Model {
    bookings () {
      return this.hasMany('App/Models/Booking')
    }
}

module.exports = Slot
