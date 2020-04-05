'use strict'
const User = use('App/Models/User')
const Env = use('Env')

class LoginController {
    async geturl ({ ally,response }) {
        //const redirect_url = await ally.driver('facebook').getRedirectUrl()
        //return response.status(200).json({ redirect_url });
        await ally.driver('facebook').redirect()
    }

    async callback ({ ally, auth, response }) {
        try {
            const fbUser = await ally.driver('facebook').getUser()

            // user details to be saved
            const userDetails = {
                firstname: fbUser.getNickname(),
                lastname: fbUser.getName(),
                password: "",
                email: fbUser.getEmail(),
                login_source: 'facebook',
                role_id: 3
            }

            // search for existing user
            const whereClause = {
                email: fbUser.getEmail()
            }

            const user = await User.findOrCreate(whereClause, userDetails)
            const { token } = await auth.generate(user)
            return response.redirect(`${Env.get('FRONT_URL')}/token/${token}`, false, 301)
        } catch (error) {
            return response.status(400).json({ 
                status: "Error",
                message: "Error on login",
                stack_trace: error.message
            });
        }
    }

    async google_geturl ({ ally,response }) {
        //const redirect_url = await ally.driver('google').getRedirectUrl()
        //return response.status(200).json({ redirect_url });
        await ally.driver('google').redirect()
    }

    async google_callback ({ ally, auth, response }) {
        try {
            const gUser = await ally.driver('google').getUser()

            // user details to be saved
            const userDetails = {
                firstname: gUser.getNickname(),
                lastname: gUser.getName(),
                password: "",
                email: gUser.getEmail(),
                login_source: 'google',
                role_id: 3
            }

            // search for existing user
            const whereClause = {
                email: gUser.getEmail()
            }

            const user = await User.findOrCreate(whereClause, userDetails)
            const { token } = await auth.generate(user)
            return response.redirect(`${Env.get('FRONT_URL')}/token/${token}`, false, 301)
        } catch (error) {
            return response.status(400).json({ 
                status: "Error",
                message: "Error on login",
                stack_trace: error.message
            });
        }
    }
}

module.exports = LoginController