'use strict'
const Bookmark = use('App/Models/Bookmark');
const User = use('App/Models/User');
const Shop = use('App/Models/Shop');

class BookmarkController {
  async getUserBookmarks({request, auth, response, params}) {
    const user = auth.user;
    const bookmarks = await user.bookmarks().fetch();
    if(bookmarks.rows.length > 0){
      return response.status(200).json({
        status: "Success",
        rows: bookmarks.rows.length,
        bookmarks
      })
    } else {
      return response.status(404).json({
        status: "Error",
        message: "No bookmarks for current user"
      })
    }
  }

  async create({ request, auth, response, params }){
    const bookmark = new Bookmark();
    bookmark.user_id = auth.user.id;
    bookmark.shop_id = params.shopId;
    const user = auth.user;
    await user.bookmarks().attach(bookmark);
    return response.status(200).json({
      status: 'Success',
      bookmark
    })
  }

  async delete({ request, auth, response, params }){
    const shop = await Shop.find(params.shopId);
    const user = auth.user;
    await user.bookmarks().detach(shop.id);
    return response.status(200).json({
      status: 'Deletion succeed'
    })
  }

}

module.exports = BookmarkController
