'use strict'

const Persona = use('Persona');

class AuthController {

  async register ({ request, response }) {
    const payload = request.only(['email', 'password', 'password_confirmation', 'firstname', 'lastname', 'profil_picture_url']);
    try {
      payload.role_id = 3;
      payload.login_source = "basic";
      const user = await Persona.register(payload);
      return response.status(200).json({
        status: "Success",
        message: 'Client account created successfully',
        user,
      })
    } catch(e) {
        return response.status(400).json({
          status: 400,
          message: 'Error on registration',
          stack_trace: e.message
        })
    }
  }

  async login ({ request, auth, response }) {
    const payload = request.only(['uid', 'password']);
    const { uid, password } = payload;
    try{
      await Persona.verify(payload);
      const { token } = await auth.attempt(uid, password);
      return response.status(200).json({ token });
    } catch(e) {
      return response.status(400).json({ 
        status: "Error",
        message: "Error on login",
        stack_trace: e.message
       });
    }
  }

  async forgotPassword ({ request, response }) {
    await Persona.forgotPassword(request.input('uid'));
    return response.status('200').json({
      message: "Mail sended to reset password"
    });
  }

  async updatePasswordByToken ({ request, response }) {
    const payload = request.only(['password', 'password_confirmation','token']);
    await Persona.updatePasswordByToken(payload.token, {password: payload.password,password_confirmation: payload.password_confirmation});
    return response.status('200').json({
      message: "Password changed!"
    });
  }

  async verifyEmail ({ request, session, response }) {
      const payload = request.only(['token']);
      try {
        const user = await Persona.verifyEmail(payload.token)
        return response.status('200').json({
          status: "Success",
          message: "Mail validate!"
        });
      } catch(e) {
        return response.status('400').json({
          status: "Error",
          message: "Error on mail validation, perhaps token expired.",
          stack_trace: e.message
        });
      }
  }

}
//test

module.exports = AuthController;
