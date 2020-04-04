'use strict'
const User = use('App/Models/User');
const Persona = use('Persona');
const moment = use('moment');
const Helpers = use('Helpers');

class UserController {
    async getById({ params, auth, response }) {
        const userId = params.userId;
        try {
            const user = await User.find(userId);
            return response.status(200).json({ user });
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting users",
                stack_trace: e
             });
        }
    }

    async getCurrentUser({auth,response}){
        const user = auth.user;
        return response.status(200).json({ user });
    }

    async getAll({ request, auth, response }){
        try {
            const users = await User.all();
            return response.status(200).json({ users });
        } catch(e) {
            return response.status(400).json({ 
                status: 400,
                message: "Error on getting users",
                stack_trace: e.message
             });
        }
    }

    async update({ request, auth, params, response }){
        const payload = request.only(['firstname', 'lastname', 'profil_picture_url', 'email']);
        const user = auth.user;
        try{
            await Persona.updateProfile(user, payload);
            return response.status(200).json({
                user,
                status: "Success",
                message:"User has been updated"
            })
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message:"Error on user update",
                stack_trace: e.message
            })
        }
    }

    async delete({ params, auth, response }){
        const userId = params.userId;
        const user = await User.find(userId);
        if(user != null){
            try{
                await user.tokens().delete();
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

    async upload_file({request, auth, response}){
        const user = auth.user;
        const { type } = request.all();
        if(type != "profil_pic" ){
            return response.status(400).json({
                status: "Error",
                message: "We need type of file, available values: profil_pic."
            })
        } else {
            const profilePic = request.file('file', {
                types: ['image'],
                size: '2mb'
            })

            const current_time = moment().format('X');
            
            await profilePic.move(Helpers.publicPath("uploads"), {
                name: `User-${user.id}-${current_time}.${profilePic.extname}`,
                overwrite: true
            })
            
            if (!profilePic.moved()) {
                return response.status(400).json({
                status: "Error",
                message: "Error on upload.",
                stack_trace:profilePic.error()
                })
            } else {
                if(type == "profil_pic"){
                    user.profil_picture_url = profilePic.fileName;
                }
                await user.save();
                return response.status(200).json({
                    status: "Success",
                    message: "File successfully uploaded.",
                    profilePic
                })
            }
        }
    }
}

module.exports = UserController
