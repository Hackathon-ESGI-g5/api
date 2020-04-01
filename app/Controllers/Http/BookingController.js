'use strict'

const Booking = use('App/Models/Booking');
const Slot = use('App/Models/Slot');
const moment = use('moment');
const Database = use('Database');


class BookingController {

  async create ({ request, auth, response, params }) {

    const slotId = params.slotId;
    const slot = await Slot.find(slotId);
    if(slot != null){
        const shopId = slot.shop_id;
        const user = auth.user;
    
        // check if user already book a slot for today
        const slotDate = moment(slot.begin_at).format('YYYY-MM-DD');
        const daySlots = await Database.table('slots').select('id').where('shop_id', shopId).where('begin_at', 'like', `%${slotDate}%`);
        const daySlotsId = daySlots.map(slot => slot.id);
        const bookings = await Database.table('bookings').whereIn('slot_id', daySlotsId).where('user_id', user.id);
    
        if (bookings.length > 0) {
          return response.status(403).json({
            error: "Vous avez déjà réservé un créneau pour aujourd'hui"
          })
        } else {
          await user.bookings().save(slot);
          slot.number_max = parseInt(slot.number_max)-1;
          await slot.save();
      
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
    const bookings = await Booking.query().where('user_id',user.id).fetch();
    if (bookings.rows.length > 0) {
      return response.status(200).json({
        status: "Success",
        rows: bookings.rows.length,
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

}

module.exports = BookingController
