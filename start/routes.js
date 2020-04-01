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
  Route.post('/search', 'ShopController.search');
  Route.delete('/:id/delete', 'ShopController.delete');
}).prefix('/shop').middleware('auth');

Route.group(() => {
  Route.post('/create', 'SlotController.create');
  Route.post('/generate', 'SlotController.generate');
  Route.get('/:id/show', 'SlotController.getById');
  Route.get('/byshop/:shop_id', 'SlotController.getByShop');
  Route.get('/all', 'SlotController.getAll');
  Route.put('/:id/edit', 'SlotController.update');
}).prefix('/slot').middleware('auth');

Route.group(() => {
  Route.post('/:shopId/create', 'ScheduleController.create');
  Route.put('/:id/edit', 'ScheduleController.update');
  Route.get('/all', 'ScheduleController.getAll');
}).prefix('/schedule').middleware('auth');

Route.group(() => {
  Route.post('/:slotId/create', 'BookingController.create')
}).prefix('/booking').middleware('auth');

//
// Route.group(() => {
//   Route.post('/:shopId/create', 'BookmarkController.create');
// }).prefix('/bookmark').middleware('auth');
