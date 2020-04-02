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

    async update({ request, auth, params, response }){
        const payload = request.only(['firstname', 'lastname', 'profile_picture_url', 'address', 'zip_code', 'city', 'birth_date', 'phone_number', 'lat', 'lng', 'active_driver', 'iban', 'bic','driving_licence_path']);
        const user = auth.user;
        try{
            await Persona.updateProfile(user, {
                'email': payload.email,
                'password': payload.password,
                'password_confirmation': payload.password_confirmation,
                'firstname': payload.firstname,
                'lastname': payload.lastname,
                'profil_picture_url': payload.profil_picture_url,
                'role_id': payload.role_id
            });
            return response.status(200).json({
                user,
                status: "Success",
                msg:"User has been updated"
            })
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                msg:"Error on user update"
            })
        }
    }

    async delete({ request, auth, response }){
        const userId = params.userId;
        const user = await User.find(userId);
        if(user != null){
            try{
                await user.delete();
                return response.status(200).json({
                    status: "Deletion succeed"
                });
            } catch(e) {
                return response.status(400).json({
                    status: "Error",
                    message: "An error occured on delete User",
                    stack_trace: e
                });
            }
        } else {
            return response.status(404).json({
                status: "Error",
                message: "User not found",
                stack_trace: e
            });
        }
    }
}

module.exports = UserController
