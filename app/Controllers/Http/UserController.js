'use strict'

class UserController {
    async getByid({ request, auth, response }) {
        const payload = request.only(['id']);
        try {
            const user = await User.find(payload.id);
            return response.status(200).json({ user });
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting users",
                stack_trace: e
             });
        }
    }

    async getAll({ request, auth, response }){
        try {
            const users = await User.all();
            return response.status(200).json({ users });
        } catch(e) {
            return response.status(400).json({ 
                status: 400,
                message: "Error on getting users",
                stack_trace: e
             });
        }
    }

    async create({ request, auth, response }){

    }

    async update({ request, auth, response }){
        
    }

    async delete({ request, auth, response }){
        
    }
}

module.exports = UserController
