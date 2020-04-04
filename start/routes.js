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

const Helpers = use('Helpers')
const fs = use('fs')
const readFile = Helpers.promisify(fs.readFile)

Route.post('update-password-by-token', 'AuthController.updatePasswordByToken');
Route.post('register', 'AuthController.register');
Route.post('register_shop', 'ShopController.create');
Route.post('login', 'AuthController.login');
Route.post('forgot-password', 'AuthController.forgotPassword');
Route.post('validate_mail', 'AuthController.verifyEmail');
//Facebook Auth
Route.get('login/facebook', 'LoginController.geturl')
Route.get('authenticated/facebook', 'LoginController.callback')
//Google Auth
Route.get('login/google', 'LoginController.google_geturl')
Route.get('authenticated/google', 'LoginController.google_callback')

Route.get('/file/:file', async ({ params }) => {
  const file = params.file;
  return await readFile(Helpers.publicPath("uploads/")+file)
})


Route.group(() => {
  Route.post('/upload', 'UserController.upload_file');
  Route.get('/all', 'UserController.getAll');
  Route.get('/current-user', 'UserController.getCurrentUser');
  Route.get('/:userId/show', 'UserController.getById');
  Route.put('/edit', 'UserController.update');
  Route.delete('/:userId/delete', 'UserController.delete');
}).prefix('/user').middleware('auth');

Route.group(() => {
  Route.get('/all', 'ShopController.getAll');
  Route.post('/search', 'ShopController.search');
  Route.get('/:shopId/show', 'ShopController.getById');
}).prefix('/shop')

Route.group(() => {
  Route.post('/upload', 'ShopController.upload_file');
  Route.post('/send_validation_shop', 'ShopController.sendValidationShop');
  Route.post('/send_validation_owner', 'ShopController.sendValidationOwner');
  Route.get('/show', 'ShopController.getByUser');
  Route.put('/:shopId/edit', 'ShopController.update');
  Route.delete('/:shopId/delete', 'ShopController.delete');
}).prefix('/shop').middleware('auth');

Route.group(() => {
  Route.get('/shop/:shopId/show', 'SlotController.getByShop');
}).prefix('/slot')

Route.group(() => {
  //Route.post('/create', 'SlotController.create');
  Route.post('/:shopId/generate', 'SlotController.generate');
  Route.get('/all', 'SlotController.getAll');
  Route.get('/:slotId/show', 'SlotController.getById');
  Route.put('/:slotId/edit', 'SlotController.update');
  Route.delete('/:slotId/delete', 'SlotController.delete');
}).prefix('/slot').middleware('auth');

Route.group(() => {
  Route.post('/:shopId/create', 'ScheduleController.create');
  Route.put('/:scheduleId/edit', 'ScheduleController.update');
  Route.get('/all', 'ScheduleController.getAll');
  Route.get('/shop/:shopId/show', 'ScheduleController.getByShop');
  Route.get('/status/:status/show', 'ScheduleController.getByStatus');
  Route.get('/:scheduleId/show', 'ScheduleController.getById');
  Route.delete('/:scheduleId/delete', 'ScheduleController.delete');
}).prefix('/schedule').middleware('auth');

Route.group(() => {
  Route.post('/:slotId/create', 'BookingController.create')
  Route.delete('/:slotId/delete','BookingController.delete')
  Route.get('/user/show','BookingController.getByUser')
  Route.get('/shop/:shopId/show','BookingController.getByShop')
  Route.get('/user/shop/:shopId/show','BookingController.getByShopAndUser')
}).prefix('/booking').middleware('auth');

Route.group(() => {
  Route.get('/show', 'BookmarkController.getUserBookmarks');
  Route.post('/:shopId/create', 'BookmarkController.create');
  Route.delete('/:shopId', 'BookmarkController.delete');
}).prefix('/bookmark').middleware('auth');

Route.group(() => {
  Route.post('/:shopId/create', 'PostController.create');
  Route.put('/:postId/edit', 'PostController.update');
  Route.delete('/:postId/delete', 'PostController.delete');
  Route.get('/all', 'PostController.getAll');
  Route.get('/shop/:shopId/show', 'PostController.getByShop');
  Route.get('/:postId/show', 'PostController.getById');
}).prefix('/post').middleware('auth');

Route.group(() => {
  Route.post('/create', 'RoleController.create');
  Route.put('/:roleId/edit', 'RoleController.update');
  Route.delete('/:roleId/delete', 'RoleController.delete');
  Route.get('/all', 'RoleController.getAll');
  Route.get('/:roleId/show', 'RoleController.getById');
}).prefix('/role').middleware('auth');


