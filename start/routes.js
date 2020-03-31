'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('update-password-by-token', 'AuthController.updatePasswordByToken');
Route.post('register', 'AuthController.register');
Route.post('login', 'AuthController.login');
Route.post('forgot-password', 'AuthController.forgotPassword');

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.post('/create', 'ShopController.create');
  Route.get('/:id/show', 'ShopController.getById');
  Route.put('/:id/edit', 'ShopController.update');
}).prefix('/shop').middleware('auth');

Route.group(() => {
  Route.post('/create', 'ShopController.create');
  Route.post('/generate', 'ShopController.generate');
  Route.get('/:id/show', 'ShopController.getById');
  Route.put('/:id/edit', 'ShopController.update');
}).prefix('/slot').middleware('auth');
