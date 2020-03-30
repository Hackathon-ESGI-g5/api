'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Shop extends Model {
    posts () {
        return this.hasMany('App/Models/Post')
    }
    slots () {
        return this.hasMany('App/Models/Slot')
    }
    schedules () {
        return this.hasMany('App/Models/Schedule')
    }
    users_bookmarkers () {
      return this.belongsToMany('App/Models/User').pivotModel('App/Models/Bookmark')
    }
    
}

module.exports = Shop
