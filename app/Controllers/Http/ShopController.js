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

    const { label, address, zip_code, city, phone_number, email, profile_picture_url, siret, siren, activity, path_to_validation_shop, path_to_validation_owner,is_validate } = request.post();
    const shop = new Shop();
    shop.user_id = auth.user.id;
    this.saveShop(shop, label, address, zip_code, city,phone_number, email, profile_picture_url, siret, siren, activity, path_to_validation_shop, path_to_validation_owner,is_validate);
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

  async saveShop(shop, label, address, zip_code, city,phone_number, email, profile_picture_url, siret, siren, activity, path_to_validation_shop, path_to_validation_owner,is_validate) {
    shop.label = label;
    shop.address = address;
    shop.zip_code = zip_code;
    shop.city = city;
    shop.phone_number = phone_number;
    shop.email = email;
    shop.profile_picture_url = profile_picture_url;
    shop.siret = siret;
    shop.siren = siren;
    shop.activity = activity;
    shop.path_to_validation_shop = path_to_validation_shop;
    shop.path_to_validation_owner = path_to_validation_owner;
    shop.is_validate = is_validate;
  };

  async update({ request, response, params }){
    const { label, address, zip_code, city, phone_number, email, profile_picture_url, siret, siren, activity, path_to_validation_shop, path_to_validation_owner,is_validate } = request.post();
    const shop = await Shop.find(params.id);
    this.saveShop(shop, label, address, zip_code, city,phone_number, email, profile_picture_url, siret, siren, activity, path_to_validation_shop, path_to_validation_owner,is_validate);
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
