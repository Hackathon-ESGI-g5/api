'use strict'

const Schedule = use('App/Models/Schedule');
const Slot = use('App/Models/Slot');
const moment = use('moment')

class SlotController {
    async getById({ params, auth, response }) {
        const slot_id = params.slotId;
        try{
            const slot = await Slot.find(slot_id);
            return response.status(200).json({
                status: "Success",
                slot
            });
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message: "Error on getting a slot by id, maybe id not exists",
                stack_trace: e
            });
        }
    }

    async getByShop({ params, auth, response }){
      moment.locale('fr');
      const user = auth.user;
      const shop = await user.shop().fetch();
      const shopId = shop.id;
        try{
            let slots = await Slot.query()
              .where('shop_id', shopId)
              .orderBy('begin_at', 'asc')
              .with('users')
              .fetch();

            // console.log(slots.toJSON());
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
            groupedSlots,
            days
          });
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message: "Error on getting a slot by id, maybe id not exists",
                stack_trace: e
            });
        }
    }

    async getAll({ request, auth, response }){
        try{
            const slots = await Slot.all();
            return response.status(200).json({
                status: "Success",
                rows: slots.rows.length,
                slots
            });
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message: "Error on getting a slot by id, maybe id not exists",
                stack_trace: e
            });
        }
    }

  async generate({ request, params, auth, response }){
    moment.locale('fr');
    const shopId = params.shopId;
    const payload = request.only(['shop_id', 'start_datetime', 'end_datetime']);
    //generate slots for a shop

    //get all schedules for a shop
    const schedules = await Schedule.query().where('shop_id', shopId).andWhere('isopen',true).fetch();
    console.log(schedules);
    const days = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday"
    }

    //foreach schedule create slots
    for(let i in schedules.rows) {
      const schedule = schedules.rows[i];
      // console.log(schedule);
      var day = moment().locale('fr').startOf('isoWeek').day(schedule.day);
      console.log(day);
      const currentyear = day.year()
      const week = day.week()
      const next_week = week+1;
      // console.log("week:",week);
      //format number of hours and minutes
      const open_hour = moment(schedule.open_hour, "H:mm").format("HH");
      const open_minutes = moment(schedule.open_hour, "H:mm").format("mm");
      const close_hour = moment(schedule.close_hour, "H:mm").format("HH");
      const close_minute = moment(schedule.close_hour, "H:mm").format("mm");

      const interval = schedule.interval;
      const end_time = moment(day);
      // define first start_datetime and end_datetime
      end_time.add({hours:close_hour,minutes:close_minute});
      day.add({hours:open_hour,minutes:open_minutes});
      console.log("Starts day : ",day)
      console.log("End day : ",end_time)

      //iter on each day
      while(currentyear == day.year() && (week == day.week() || next_week == day.week())){
        // console.log(day);
        // console.log(end_time);
        // console.log(day.unix())
        // console.log(end_time.unix())
        var temp_day = moment(day);
        while(end_time.unix() > temp_day.unix()){
          //verify if slot exists in this period
          var b = temp_day.format();
          var e = temp_day.add({minutes:interval}).format();
          const slots = await Slot.query()
            .where('begin_at', "in", [b,e])
            .andWhere('end_at', 'in', [b,e])
            .andWhere('day', '=', schedule.day)
            .andWhere('shop_id', '=', schedule.shop_id)
            .fetch();
          if(slots.rows.length == 0){
            const slot = new Slot();
            slot.shop_id = shopId;
            slot.begin_at = b;
            //add value and increment for while loop
            slot.end_at = e;
            slot.number_max = schedule.number_max
            slot.day = schedule.day
            slot.save();
            // console.log("saved");
            // console.log(temp_day);
          }
        }
        day.add(7,'day');
        end_time.add(7,'day');
      }
      // console.log(currentyear);
    }

    return response.status(200).json({
      msg:"success"
    });
  }


  async update({ params, request, auth, response }){
        const slotId = params.slotId
        const {begin_at,end_at,number_max,day} = request.post();
        const slot = await Slot.find(slotId);
        if(slot != null){
            slot.begin_at = begin_at;
            slot.end_at = end_at;
            slot.number_max = number_max;
            slot.day = day;
            await slot.save();
            return response.status(200).json({
                status: "Success",
                slot
            });
        } else {
            return response.status(400).json({
                status: "Error",
                message: "Slot not found"
            })
        }

    }

    async delete({ params, auth, response }){
        const slotId = params.slotId;
        const slot = await Slot.find(slotId);
        if(slot != null){
            try{
                await slot.delete();
                return response.status(200).json({
                    status: "Deletion succeed"
                });
            } catch(e) {
                return response.status(400).json({
                    status: "Error",
                    message: "An error occured on delete Slot",
                    stack_trace: e
                });
            }
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Slot not found",
                stack_trace: e
            });
        }
    }
}

module.exports = SlotController
