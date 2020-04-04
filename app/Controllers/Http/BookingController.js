'use strict'

const Booking = use('App/Models/Booking');
const User = use('App/Models/User');
const Slot = use('App/Models/Slot');
const moment = use('moment');
const Database = use('Database');


class BookingController {

  async create ({ request, auth, response, params }) {

    const slotId = params.slotId;
    const slot = await Slot.find(slotId);

    if (slot.number_max === 0){
      return response.status(403).json({
        error: 'Ce créneau est déjà complet'
      })
    }

    if(slot != null){
        const shopId = slot.shop_id;
        const user = auth.user;

        // check if user already book a slot for today
        const slotDate = moment(slot.begin_at).format('YYYY-MM-DD');
        const slotDatePlusOneDay = moment(slot.begin_at).add(1, 'day').format('YYYY-MM-DD');
        const daySlots = await Slot.query().where('shop_id', shopId).andWhereBetween('begin_at', [slotDate, slotDatePlusOneDay]).setVisible('id').fetch();
        const daySlotsId = daySlots.rows.map(slot => slot.id);
        const bookings = await Database.table('bookings').whereIn('slot_id', daySlotsId).where('user_id', user.id);

        if (bookings.length > 0) {
          return response.status(403).json({
            error: "Vous avez déjà réservé un créneau pour aujourd'hui"
          })
        } else {
          slot.number_max = parseInt(slot.number_max)-1;
          await slot.save();
          await user.bookings().save(slot);
          return response.status(200).json({
            'status': 'Success',
            slot
          });
        }
    } else {
      return response.status(200).json({
        status: 'Error',
        messsage: "Slot not found"
      });
    }
  }

  async delete({ request, auth, response, params }){
    const slotId = params.slotId;
    const user = auth.user;
    console.log();
    try {
      await user.bookings().detach([slotId])
      return response.status(200).json({
        "status": "Success"
      })
    } catch(e) {
      return response.status(400).json({
        status: "Error",
        message: "Error on Booking deletion.",
        stack_trace: e
      })
    }
  }

  async getByUser({request,params,auth,response}){
    const user = auth.user;
    const results = await Database.raw(
      'SELECT sl.begin_at, s.id, s.label, s.address, s.city FROM users u JOIN bookings b ON b.user_id = u.id JOIN slots sl ON b.slot_id = sl.id JOIN shops s ON sl.shop_id = s.id WHERE u.id = ?'
    , [user.id]);
    const {rows} = results;
    const bookings = rows.map(row => {
      return {
        formattedHour: moment(row.begin_at).format('HH:MM'),
        formattedDay: moment(row.begin_at).format('DD-MM-YYYY'),
        label: row.label,
        address: row.address,
        city: row.city
      }
    });
    if (rows.length > 0) {
      return response.status(200).json({
        status: "Success",
        bookings
      });
    } else {
      return response.status(404).json({
        status: "Error",
        message: "No bookings found for this user"
      });
    }
  }

  async getByShop({request,params,auth,response}){
    const shopId = params.shopId;
    const slots = await Slot.query().where('shop_id',shopId).setVisible(['id']).fetch();
    const slotsIds = slots.rows.map(slot => slot.id);
    if(slots.rows.length > 0){
      const bookings = await Booking.query().where('slot_id','in',slotsIds).fetch();
      if (bookings.rows.length > 0) {
        return response.status(200).json({
          status: "Success",
          rows: bookings.rows.length,
          bookings
        });
      } else {
        return response.status(404).json({
          status: "Error",
          message: "No bookings found for the shop existing slots"
        });
      }
    } else {
      return response.status(404).json({
        status: "Error",
        message: "No Shop found for this id"
      });
    }
  }

  /**
   * retrieve bookings by slots date (starting from today) for a given store id
   * @param request
   * @param params
   * @param auth
   * @param response
   * @returns {Promise<*>}
   */
  async getByShopAndUser({request, params,auth,response}) {
    moment.locale('fr');
    const shopId = params.shopId;

    const today = moment().format('YYYY-MM-DD');
    let slots = await Slot.query()
      .where('shop_id', shopId)
      .where('begin_at', '>=', today)
      .with('bookings', (builder) => {
        builder.where('user_id', auth.user.id)
      })
      .orderBy('begin_at', 'asc')
      .fetch();

    slots = slots.toJSON();
    slots = slots.map(slot => ( {
      bookings: slot.bookings,
      formattedDay: moment(slot.begin_at).format('YYYY-MM-DD'),
    }));

    const groupedSlots = {};
    slots.forEach(slot => {
      if (!(slot.formattedDay in groupedSlots)) {
        groupedSlots[slot.formattedDay] = [];
      }
      groupedSlots[slot.formattedDay].push(slot);
    });
    return response.status(200).json(groupedSlots);
  }

}

module.exports = BookingController
