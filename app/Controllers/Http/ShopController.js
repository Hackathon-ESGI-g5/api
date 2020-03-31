'use strict'

const Shop = use('App/Models/Shop');

class ShopController {
  async getByid({ request, auth, response }) {

  }

  async getAll({ request, auth, response }){

  }

  async create({ request, auth, response }){

    const { label, address, zip_code, city } = request.post();
    const shop = new Shop();
    shop.user_id = auth.user.id;
    shop.label = label;
    shop.address = address;
    shop.zip_code = zip_code;
    shop.city = city;

    await shop.save();

    return response.status(200).json({
      status: "Success",
      shop
    });
  }

  async update({ request, auth, response }){

  }

  async delete({ request, auth, response }){

  }
}

module.exports = ShopController