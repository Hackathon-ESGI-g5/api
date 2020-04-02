'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/Role', async (faker,i) => {
  return {
    id: [1,2,3][i],
    label: ['Admin', 'Commerçant', 'Particulier'][i],
    description: ["Administrateur de la plateforme","Compte commerçant","Compte particulier"][i],
    level: [1,2,3][i],
  }
})
