'use strict'
const Schedule = use('App/Models/Schedule');

class ScheduleController {
    async getByid({ request, auth, response }) {

    }

    async getByShop({ request, auth, response }){

    }

    async getByStatus({ request, auth, response }){

    }

    async getAll({ request, auth, response }){

    }

    async create({ request, response, params }){
      const shopId = params.shopId;
      const { open_hour, close_hour, interval, day, isopen, number_max } = request.post();
      const schedule = new Schedule;
      schedule.open_hour = open_hour;
      schedule.close_hour = close_hour;
      schedule.interval = interval;
      schedule.day = day;
      schedule.isopen = isopen;
      schedule.shop_id = shopId;
      schedule.number_max = number_max;

      await schedule.save();

      return response.status(200).json({
        status: "Success",
        schedule
      })
    }

    async update({ request, auth, response }){

    }

    async delete({ request, auth, response }){

    }
}

module.exports = ScheduleController
