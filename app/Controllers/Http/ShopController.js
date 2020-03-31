'use strict'

const Shop = use('App/Models/Shop');

class ShopController {
  async getByid({ request, auth, response }) {

  }

  async getAll({ request, auth, response }){

  }

  async search({ request, auth, response }){
    const { text, lng, lat, address, zip_code, city } = request.post();
    try{
      const shops = await Shop.query()
        .where('label', 'like', text)
        .or('address', 'like', text)
        .or('city', 'like', text)
        .or('zip_code', 'like', text)
        .fetch();
      return response.status(200).json({
        shops
      })
    } catch(e) {
      return response.status(400).json({
        status: "Error",
        message: "Error during search",
        stack_trace: e
      })
    }
  }

  async create({ request, auth, response }){

    const { label, address, zip_code, city } = request.post();
    const shop = new Shop();
    shop.user_id = auth.user.id;
    shop.label = label;
    shop.address = address;
    shop.zip_code = zip_code;
    shop.city = city;

    try{
      await shop.save();
      return response.status(201).json({
        status: "Success",
        shop
      });
    } catch(e) {
      return response.status(400).json({
        status: "Error",
        message: "An error occured on create Shop",
        stack_trace: e
      });
    }
  }

  async update({ request, auth, response }){

  }

  async delete({ request, auth, response }){

  }
}

module.exports = ShopController
