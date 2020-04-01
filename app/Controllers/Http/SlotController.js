'use strict'

const Schedule = use('App/Models/Schedule');
const Slot = use('App/Models/Slot');
const moment = use('moment')

class SlotController {
    async getById({ params, auth, response }) {
        const slot_id = params.id;
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
        const shop_id = params.shop_id
        try{
            const slots = await Slot.query().where('shop_id', shop_id).fetch();
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

    async generate({ request, auth, response }){
        const payload = request.only(['shop_id', 'start_datetime', 'end_datetime']);
        //generate slots for a shop

        //get all schedules for a shop
        const schedules = await Schedule.query().where('shop_id', payload.shop_id).fetch();

        const days = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday"
        }

        //foreach schedule create a slot
        for(let i in schedules.rows) {
            const schedule = schedules.rows[i];
                // console.log(schedule);
            var day = moment().startOf('week').day(days[schedule.day]);
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
                        slot.shop_id = payload.shop_id;
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
                day.add(7,'d');
                end_time.add(7,'d');
            }
            // console.log(currentyear);
        }

        return response.status(200).json({
            schedules
        });
    }

    async create({ request, auth, response }){

    }

    async update({ request, auth, response }){
        const payload = request.only(['shop_id']);


    }

    async delete({ request, auth, response }){

    }
}

module.exports = SlotController
