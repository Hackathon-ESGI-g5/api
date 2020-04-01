'use strict'
const Schedule = use('App/Models/Schedule');
const Slot = use('App/Models/Slot');
const moment = use('moment')

class ScheduleController {
    async getByid({ request, auth, response }) {

    }

    async getByShop({ request, auth, response }){

    }

    async getByStatus({ request, auth, response }){

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
                message: "Error on getting a slot by id, maybe id not exists",
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
        const schedule_id = params.id;
        const { open_hour, close_hour, interval, day, isopen, number_max } = request.post();
        //const schedule = Schedule.query().where("shop_id",shopId).andWhere("day",day).first();
        const schedule = await Schedule.find(schedule_id);
        if(schedule != null){ //schedule exists
            // define updates for slots
            var update_on_openning = false;
            var update_on_interval = false;
            var update_on_number_max = false;
            if( schedule.open_hour != open_hour || schedule.close_hour != close_hour ) update_on_openning = true;
            if( schedule.interval != interval ) update_on_interval = true;
            if( schedule.number_max != number_max ) update_on_number_max = true;

            //do updates for schedule
            schedule.open_hour = open_hour;
            schedule.close_hour = close_hour;
            schedule.interval = interval;
            schedule.day = day;
            schedule.isopen = isopen;
            schedule.number_max = number_max;
            await schedule.save()

            //async updates for slots
            this.updateSlots({update_on_openning,update_on_interval,update_on_number_max,schedule});

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

    async updateSlots({update_on_openning,update_on_interval,update_on_number_max,schedule}){
        console.log("starting updatesSlot");

        // updates on interval between slots
        if(update_on_interval){
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
                            .delete();
                        console.log("Slots deleted between "+currentdate.format()+" and "+tomorrow.format());
                    }
                }
                currentdate.add(1,"day");//increment currentdate to pass to next day on the loop
            }
                
        }
        
        //update for openning dates
        if(update_on_openning){
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
                .fetch();
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
                //return response.ok(slots);
            } else {
                //create
            }
        }

        // updates if number_max per slots changed
        if(update_on_number_max){

        }
        
    }

    async delete({ request, auth, response }){

    }
}

module.exports = ScheduleController
