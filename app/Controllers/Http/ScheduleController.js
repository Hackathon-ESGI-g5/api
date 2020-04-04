'use strict'
const Schedule = use('App/Models/Schedule');
const Slot = use('App/Models/Slot');
const Booking = use('App/Models/Booking');
const SlotController = use('App/Controllers/Http/SlotController');
const moment = use('moment')

class ScheduleController {
    async getById({ params, auth, response }) {
        const scheculeId = params.scheduleId;
        const schedule = await Schedule.find(scheculeId);
        if(schedule != null){
            return response.status(200).json({
                status: "Success",
                schedule
            });
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Schedule doesn't exists"
            });
        }
    }

    async getByShop({ request, auth, params, response }){
        const shopId = params.shopId;
        try{
            const schedules = await Schedule.query().where("shop_id",shopId).orderBy('day', 'asc').fetch();
            const json = schedules.toJSON();
            const interval = json[0].interval;
            const number_max = json[0].number_max;
            return response.status(200).json({
              status: "Success",
              rows: schedules.rows.length,
              interval,
              number_max,
              schedules,
            });
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message: "Error on getting a Schedule by shop, maybe id not exists",
                stack_trace: e
            });
        }
    }

    async getByStatus({ params, auth, response }){
        const status = params.status;
        const schedules = await Schedule.query().where("isopen", status).fetch();
        if(schedules.rows.length > 0){
            return response.status(200).json({
                status: "Success",
                rows: schedules.rows.length,
                schedules
            });
        } else {
            return response.status(404).json({
                status: "Error",
                message: "No Schedule found"
            });
        }
    }

    async getAll({ request, auth, response }){
        try{
            const schedules = await Schedule.all();
            return response.status(200).json({
                status: "Success",
                rows: schedules.rows.length,
                schedules
            });
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message: "Error on getting a schedule by id, maybe id not exists",
                stack_trace: e
            });
        }
    }

    async create({ request, response, params }){
      const shopId = params.shopId;
      const { open_hour, close_hour, interval, day, isopen, number_max } = request.post();

      // check if schedule exists for the day and the shop before create a new

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

    async update({ request, params, auth, response }){
        const schedule_id = params.scheduleId;
        const { open_hour, close_hour, interval, day, isopen, number_max } = request.post();
        //const schedule = Schedule.query().where("shop_id",shopId).andWhere("day",day).first();
        const schedule = await Schedule.find(schedule_id);
        if(schedule != null){ //schedule exists
            // define updates for slots
            var update_on_openning = false;
            var update_on_interval = false;
            var update_on_number_max = false;
            var older_numbermax = null;
            if( schedule.open_hour != open_hour || schedule.close_hour != close_hour ) update_on_openning = true;
            if( schedule.interval != interval ) update_on_interval = true;
            if( schedule.number_max != number_max ){
                update_on_number_max = true;
                older_numbermax = parseInt(schedule.number_max);
            }

            //do updates for schedule
            schedule.open_hour = open_hour;
            schedule.close_hour = close_hour;
            schedule.interval = interval;
            schedule.day = day;
            schedule.isopen = isopen;
            schedule.number_max = number_max;
            await schedule.save()

            //async updates for slots
            this.updateSlots({update_on_openning,update_on_interval,update_on_number_max,older_numbermax,schedule});

            return response.status(200).json({
                status: "Success",
                schedule
            })
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Schedule not found"
            })
        }
    }

    async updateSlots({update_on_openning,update_on_interval,update_on_number_max,older_numbermax,schedule}){
        console.log("starting updatesSlot");

        // updates on interval between slots
        if(update_on_interval){
            console.log("==== Starting update on interval");
            //current dates for finding existings slots
            var currentdate = moment().startOf('day')
            var in_two_weeks = moment(currentdate).add(2,"week")
            console.log(currentdate);
            console.log(in_two_weeks);
            while(currentdate.format() <= in_two_weeks.format()){ // tant que l'on est dans les 15 prochains jours
                    //get slots available on this period to update them.
                var tomorrow = moment(currentdate).add(1,"day");
                const slots = await Slot.query()
                    .where('begin_at', '>', currentdate.format())
                    .andWhere('end_at', '<', tomorrow.format())
                    .andWhere('day', '=', schedule.day)
                    .andWhere('shop_id', '=', schedule.shop_id)
                    .fetch();
                if(slots.rows.length > 0){ // SLOTS of a day
                    var number_slots_without_booking = 0;
                    for(let i in slots.rows){//check for each slot on the day if he has booking or not
                        if(schedule.number_max == slots.rows[i].number_max){
                            number_slots_without_booking += 1;
                        }
                    }
                    if(number_slots_without_booking == slots.rows.length){ // if all slots on current day haven't booking
                        // we delete all slots of this day
                        await Slot.query()
                            .where('begin_at', '>', currentdate.format())
                            .andWhere('end_at', '<', tomorrow.format())
                            .andWhere('day', '=', schedule.day)
                            .andWhere('shop_id', '=', schedule.shop_id)
                            .delete();
                        console.log("Slots deleted between "+currentdate.format()+" and "+tomorrow.format());
                    }
                }
                currentdate.add(1,"day");//increment currentdate to pass to next day on the loop
            }
            console.log("==== Update on interval complete");
        }

        //update for openning dates
        if(update_on_openning){
            console.log("==== Starting update on openning");
            //current dates for finding existings slots
            var currentdate = moment().startOf('day')
            var in_two_weeks = moment(currentdate).add(2,"week")
            console.log(currentdate);
            console.log(in_two_weeks);
                //get slots available on this period to update them.
            const slots = await Slot.query()
                .where('begin_at', '>', currentdate.format())
                .andWhere('end_at', '<', in_two_weeks.format())
                .andWhere('day', '=', schedule.day)
                .andWhere('shop_id', '=', schedule.shop_id)
                .fetch();
            console.log(slots.rows);
            if(slots.rows.length > 0){
                    //calculate timestamps for open/close datetime in each slot.
                const openH = moment(schedule.open_hour, "H:mm").format("HH");
                const openM = moment(schedule.open_hour, "H:mm").format("mm");
                const closeH = moment(schedule.close_hour, "H:mm").format("HH");
                const closeM = moment(schedule.close_hour, "H:mm").format("mm");
                    //update
                for(let i in slots.rows){
                    var begin = moment(slots.rows[i].begin_at);
                    var end = moment(slots.rows[i].end_at);
                    // if slot begin hour or minutes in hour is inferior of schedule open hours-minutes.
                    if( (begin.format("HH") < openH) || ((begin.format("HH") == openH) && (begin.format("mm") < openM))){
                        //delete
                        var slot = await Slot.find(slots.rows[i].id);
                        await slot.delete();
                    } // if slot end hour is higher or end hour is equal but minutes higher of schedule end hours-minutes
                    else if( (end.format("HH") > closeH) || ((end.format("HH") == closeH) && (end.format("mm") > closeM))){
                        //delete
                        var slot = await Slot.find(slots.rows[i].id);
                        await slot.delete();
                    }
                }
            }
            console.log("==== Update on openning complete");
        }

        // updates if number_max per slots changed
        if(update_on_number_max){
            console.log("==== Starting update on numbermax");
            //current dates for finding existings slots
            var currentdate = moment().startOf('day')
            var in_two_weeks = moment(currentdate).add(2,"week")
            console.log(currentdate);
            console.log(in_two_weeks);
                //get slots available on this period to update them.
            const slots = await Slot.query()
                .where('begin_at', '>', currentdate.format())
                .andWhere('end_at', '<', in_two_weeks.format())
                .andWhere('day', '=', schedule.day)
                .andWhere('shop_id', '=', schedule.shop_id)
                .fetch();
            if(slots.rows.length > 0){
                for(let i in slots.rows){
                    console.log("older_numbermax : ",older_numbermax);
                    console.log("new_numbermax : ",schedule.number_max);
                    if(slots.rows[i].number_max == older_numbermax){ // if no booking on slots, juste update the number by the new
                        /*const slot = await Slot.find(slots.rows[i].id);
                        slot.number_max = schedule.number_max;
                        await slot.save();*/
                    } else { // if a slot had booking, count them
                        const bookings = await Booking.query().where("slot_id",slots.rows[i].id).fetch()
                        if(bookings.rows.length >= schedule.number_max){ // if slot has more or equal number of booking than the new number_max, then put slot's number_max to 0
                            /*const slot = await Slot.find(slots.rows[i].id);
                            slot.number_max = 0;
                            await slot.save();*/
                        } else if(bookings.rows.length < schedule.number_max){ // if slot has less number of booking than the new number_max, then put slot's number_max to difference between booking's and new number_max
                            /*const slot = await Slot.find(slots.rows[i].id);
                            slot.number_max = schedule.number_max-bookings.rows.length;
                            await slot.save();*/
                        }
                    }
                }
            }
            console.log("==== Update on numbermax complete");
        }

        //generate needed after deletion
        /*SlotController.generate({request: {
                shop_id: schedule.shop_id
            }
        });*/

    }

    async delete({ params, auth, response }){
        // TODO : handle relations delete
        const schedule = await Schedule.find(params.scheduleId);
        if(schedule != null){
            await schedule.delete();
            return response.status(200).json({
                status: `Schedule ${params.scheduleId} deleted`,
            });
        } else {
            return response.status(400).json({
                status: `Error`,
                message: "Error on delete Schedule"
            });
        }
    }
}

module.exports = ScheduleController
