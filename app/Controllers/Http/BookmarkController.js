'use strict'
const Bookmark = use('App/Models/Bookmark');
const User = use('App/Models/User');
const Shop = use('App/Models/Shop');

class BookmarkController {

  async create({ request, auth, response, params }){
    const bookmark = new Bookmark();
    bookmark.user_id = auth.user.id;
    bookmark.shop_id = params.shopId;
    const user = auth.user;
    await user.bookmarks().save(bookmark);
    return response.status(200).json({
      status: 'Success',
      bookmark
    })
  }

  async delete({ request, auth, response, params }){
    // const bookmark = Bookmark.find()
  }

}

module.exports = BookmarkController
