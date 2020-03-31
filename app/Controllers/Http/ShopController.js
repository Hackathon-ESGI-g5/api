'use strict'

const Shop = use('App/Models/Shop');

class ShopController {

  async getById({ request, auth, response, params }) {
    // TODO ADD SCHEDULES
    const id = params.id;
    const shop = await Shop.find(id);
    const schedules = await shop.schedules().fetch();
    return response.status(201).json({
      status: "Success",
      shop,
      schedules,
    });
  }

  async getAll({ request, auth, response }){

  }

  async create({ request, auth, response }){

    const { label, address, zip_code, city } = request.post();
    const shop = new Shop();
    shop.user_id = auth.user.id;
    this.saveShop(shop, label, address, zip_code, city);
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


  async saveShop(shop, label, address, zip_code, city) {
    shop.label = label;
    shop.address = address;
    shop.zip_code = zip_code;
    shop.city = city;
  };

  async update({ request, response, params }){
    const { label, address, zip_code, city } = request.post();
    const shop = await Shop.find(params.id);
    this.saveShop(shop, label, address, zip_code, city);
    try{
      await shop.save();
      return response.status(200).json({
        status: "Update Success",
        shop
      });
    } catch(e) {
      return response.status(400).json({
        status: "Error",
        message: "An error occured on update Shop",
        stack_trace: e
      });
    }
  }

  async delete({ request, auth, response, params }){
    // TODO : handle relations delete
    const shop = await Shop.find(params.id);
    await shop.delete();
    return response.status(200).json({
      status: `Shop ${params.id} deleted`,
      shop
    });
  }
}

module.exports = ShopController
