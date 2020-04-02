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
  Route.get('/:id/show', 'UserController.getById');
  Route.put('/:id/edit', 'UserController.update');
  Route.post('/search', 'UserController.search');
  Route.delete('/:id/delete', 'UserController.delete');
}).prefix('/user').middleware('auth');

Route.group(() => {
  Route.post('/create', 'ShopController.create');
  Route.get('/:id/show', 'ShopController.getById');
  Route.put('/:id/edit', 'ShopController.update');
  Route.post('/search', 'ShopController.search');
  Route.delete('/:id/delete', 'ShopController.delete');
}).prefix('/shop').middleware('auth');

Route.group(() => {
  //Route.post('/create', 'SlotController.create');
  Route.post('/:shopId/generate', 'SlotController.generate');
  Route.update('/:shopId/edit', 'SlotController.update');
  Route.get('/:id/show', 'SlotController.getById');
  Route.get('/byshop/:shop_id', 'SlotController.getByShop');
  Route.get('/all', 'SlotController.getAll');
  Route.put('/:id/edit', 'SlotController.update');
}).prefix('/slot').middleware('auth');

Route.group(() => {
  Route.post('/:shopId/create', 'ScheduleController.create');
  Route.put('/:id/edit', 'ScheduleController.update');
  Route.get('/all', 'ScheduleController.getAll');
  Route.get('/:id/show', 'ScheduleController.getAll');
  Route.get('/shop/:shopId', 'ScheduleController.getByShop');
  Route.get('/status/:status', 'ScheduleController.getByStatus');
}).prefix('/schedule').middleware('auth');

Route.group(() => {
  Route.post('/:slotId/create', 'BookingController.create')
  Route.delete('/:slotId','BookingController.delete')
  Route.get('/user/','BookingController.getByUser')
  Route.get('/shop/:shopId','BookingController.getByShop')
}).prefix('/booking').middleware('auth');

Route.group(() => {
  Route.post('/:shopId/create', 'BookmarkController.create');
  Route.delete('/:shopId', 'BookmarkController.delete');
}).prefix('/bookmark').middleware('auth');

Route.group(() => {
  Route.post('/:storeId/create', 'PostController.create');
  Route.put('/:postId/update', 'PostController.update');
  Route.delete('/:postId', 'PostController.delete');
  Route.get('/all', 'PostController.getAll');
  Route.get('/:postId/show', 'PostController.getById');
  Route.get('/store/:storeId', 'PostController.getById');
}).prefix('/post').middleware('auth');

Route.group(() => {
  Route.post('/:storeId/create', 'RoleController.create');
  Route.put('/:roleId/update', 'RoleController.update');
  Route.delete('/:roleId', 'RoleController.delete');
  Route.get('/all', 'RoleController.getAll');
  Route.get('/:roleId/show', 'RoleController.getById');
}).prefix('/role').middleware('auth');


