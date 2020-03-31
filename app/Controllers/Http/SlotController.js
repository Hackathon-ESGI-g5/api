'use strict'

class SlotController {
    async getByid({ request, auth, response }) {

    }

    async getByShop({ request, auth, response }){
        
    }
    
    async getAll({ request, auth, response }){
        
    }

    async generate({ request, auth, response }){
        const payload = request.only(['shop_id']);
        //generate slots for a shop
        const schedules = await Schedule.findByOrFail('shop_id', payload.shop_id);
        return response.status(200).json({
            schedules
        });
    }

    async create({ request, auth, response }){

    }

    async update({ request, auth, response }){

    }

    async delete({ request, auth, response }){
        
    }
}

module.exports = SlotController
