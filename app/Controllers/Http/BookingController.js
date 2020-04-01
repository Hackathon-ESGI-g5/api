'use strict'

const Booking = use('App/Models/Booking');
const Slot = use('App/Models/Slot');
const moment = use('moment');
const Database = use('Database');


class BookingController {

  async create ({ request, auth, response, params }) {

    const slotId = params.slotId;
    const slot = await Slot.find(slotId);
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
    }

    await user.bookings().save(slot);

    return response.status(200).json({
      'ok': 'ok'
    });
  }

  async delete({ request, auth, response, params }){
    const slotId = params.slotId;
    const user = auth.user;
    const booking = await Booking.find()
  }

}

module.exports = BookingController
