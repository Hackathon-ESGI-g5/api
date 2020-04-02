'use strict'

const Shop = use('App/Models/Shop');
const Database = use('Database');
const Persona = use('Persona');
const moment = use('moment');
const Slot = use('App/Models/Slot');

class ShopController {

  async getByUser({ request, auth, response, params }) {
    moment.locale('fr');
    const user = auth.user;

    let shop = await Shop.query().where("user_id", user.id).with('schedules', (builder) => {
      builder.orderBy('id', 'asc')
    }).fetch();
    shop = shop.toJSON()[0];
    if(shop != null){
      const today = moment().format('YYYY-MM-DD');

      let slots = await Slot.query()
        .where('shop_id', shop.id)
        .where('begin_at', '>=', today)
        .orderBy('begin_at', 'asc')
        .with('bookings', (builder) => {
          builder.where('user_id', user.id)
        }).fetch();

      slots = slots.toJSON();
      slots = slots.map(slot => ( {
        ...slot,
        formattedDay: moment(slot.begin_at).format('YYYY-MM-DD'),
        formattedHour: moment(slot.begin_at).format('HH:mm')
      }));

      const groupedSlots = {};
      slots.forEach(slot => {
        if (!(slot.formattedDay in groupedSlots)) {
          groupedSlots[slot.formattedDay] = [];
        }
        groupedSlots[slot.formattedDay].push(slot);
      });

      const days = {};
      const daysDate = Object.keys(groupedSlots);
      daysDate.forEach(date => {
        days[date] = moment(date).format('dddd Do MMMM YYYY')
      });

      return response.status(200).json({
        status: "Success",
        shop,
        slots_number: slots.length,
        slots: groupedSlots,
        days
      });
    } else {
      return response.status(404).json({
        status: "Error",
        message: "No shops for current user"
      });
    }

    
  }

  async getById({ request, auth, response, params }) {
    moment.locale('fr');
    const id = params.shopId;

    let shop = await Shop.query().where('id', id).with('schedules', (builder) => {
      builder.orderBy('id', 'asc')
    }).fetch();
    shop = shop.toJSON()[0];

    const today = moment().format('YYYY-MM-DD');

    let slots = await Slot.query()
      .where('shop_id', id)
      .where('begin_at', '>=', today)
      .orderBy('begin_at', 'asc')
      .with('bookings', (builder) => {
        builder.where('user_id', auth.user.id)
      })
      .fetch()
    ;

    slots = slots.toJSON();
    slots = slots.map(slot => ( {
      ...slot,
      formattedDay: moment(slot.begin_at).format('YYYY-MM-DD'),
      formattedHour: moment(slot.begin_at).format('HH:mm')
    }));

    const groupedSlots = {};
    slots.forEach(slot => {
      if (!(slot.formattedDay in groupedSlots)) {
        groupedSlots[slot.formattedDay] = [];
      }
      groupedSlots[slot.formattedDay].push(slot);
    });

    const days = {};
    const daysDate = Object.keys(groupedSlots);
    daysDate.forEach(date => {
      days[date] = moment(date).format('dddd Do MMMM YYYY')
    });

    return response.status(200).json({
      status: "Success",
      shop,
      slots_number: slots.length,
      slots: groupedSlots,
      days
    });
  }

  async getAll({ request, auth, response }){
    const shops = await Shop.query().with('schedules', (builder) => {
      builder.orderBy('id', 'asc')
    }).fetch();
    return response.status(200).json({
        status: "Success",
        rows: shops.rows.length,
        shops
    });
  }

  async search({ request, auth, response }){
    const { text, lng, lat, address, zip_code, city } = request.post();
    try{
      const shops = await Shop.query()
        .where('label', 'like', `%${text}%`)
        .orWhere('address', 'like', `%${text}%`)
        .orWhere('city', 'like', `%${text}%`)
        .orWhere('zip_code', 'like', `%${text}%`)
        .fetch();
      return response.status(200).json({
        shops
      })
    } catch(e) {
      return response.status(400).json({
        status: "Error",
        message: "Error during search",
        stack_trace: e.message
      })
    }
  }

  async create({ request, auth, response }){
    console.log(request.post());
    const {email, password, password_confirmation, firstname, lastname} = request.post();
    try {
      const user = await Persona.register({email, password, password_confirmation, firstname, lastname, role_id:2 });
      if(user.id != null){
        const { label, address, zip_code, city, phone_number, email, profile_picture_url, siret, siren, activity, path_to_validation_shop, path_to_validation_owner } = request.post();
        const shop = new Shop();
        shop.user_id = user.id;
        this.saveShop(shop, label, address, zip_code, city, phone_number, email, profile_picture_url, siret, siren, activity, path_to_validation_shop, path_to_validation_owner,0);
        try{
          await shop.save();
          return response.status(201).json({
            status: "Shop successfully created",
            user,
            shop
          });
        } catch(e) {
          return response.status(400).json({
            status: "Error",
            message: "An error occured on Shop creation",
            stack_trace: e
          });
        }
      }
    } catch(e) {
        return response.status(400).json({
          status: 400,
          message: 'Error on user registration',
          stack_trace: e.message
        })
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
    const shop = await Shop.find(params.shopId);
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
    const shop = await Shop.find(params.shopId);
    await shop.delete();
    return response.status(200).json({
      status: `Shop ${params.shopId} deleted`,
    });
  }
}

module.exports = ShopController
