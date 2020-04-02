'use strict'
const User = use('App/Models/User')

class LoginController {
    async geturl ({ ally,response }) {
        const redirect_url = await ally.driver('facebook').getRedirectUrl()
        return response.status(200).json({ redirect_url });
        //await ally.driver('facebook').redirect()
    }

    async callback ({ ally, auth, response }) {
        try {
            const fbUser = await ally.driver('facebook').getUser()

            // user details to be saved
            const userDetails = {
                email: fbUser.getEmail(),
                token: fbUser.getAccessToken(),
                login_source: 'facebook'
            }

            // search for existing user
            const whereClause = {
                email: fbUser.getEmail()
            }

            const user = await User.findOrCreate(whereClause, userDetails)
            const { token } = await auth.login(user)
            return response.status(200).json({ token });
        } catch (error) {
            return response.status(400).json({ 
                status: "Error",
                message: "Error on login",
                stack_trace: error.message
            });
        }
    }

    async google_geturl ({ ally,response }) {
        const redirect_url = await ally.driver('google').getRedirectUrl()
        return response.status(200).json({ redirect_url });
        //await ally.driver('google').redirect()
    }

    async google_callback ({ ally, auth, response }) {
        try {
            const fbUser = await ally.driver('google').getUser()

            // user details to be saved
            const userDetails = {
                email: fbUser.getEmail(),
                token: fbUser.getAccessToken(),
                login_source: 'google'
            }

            // search for existing user
            const whereClause = {
                email: fbUser.getEmail()
            }

            const user = await User.findOrCreate(whereClause, userDetails)
            const { token } = await auth.login(user)
            return response.status(200).json({ token });
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