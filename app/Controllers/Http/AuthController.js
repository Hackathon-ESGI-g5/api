'use strict'

const Persona = use('Persona');

class AuthController {

  async register ({ request, response }) {
    const payload = request.only(['email', 'password', 'password_confirmation', 'firstname', 'lastname', 'profil_picture_url', 'role_id']);
    try {
      const user = await Persona.register(payload);
      return response.status(200).json({
        user,
        status: 200,
        message: 'Client account created successfully',
      })
    } catch(e) {
        return response.status(400).json({
          status: 400,
          message: 'Error on registration',
        })
    }
  }

  async login ({ request, auth, response }) {
    const payload = request.only(['uid', 'password']);
    const { uid, password } = payload;
    await Persona.verify(payload);
    const { token } = await auth.attempt(uid, password);
    return response.ok({ token });
  }

  async forgotPassword ({ request, response }) {
    await Persona.forgotPassword(request.input('uid'));
    return response.status('200').json({
      message: "Mail sended to reset password"
    });
  }

  async updatePasswordByToken ({ request, params }) {
    const payload = request.only(['password', 'password_confirmation','token']);
    await Persona.updatePasswordByToken(payload.token, {password: payload.password,password_confirmation: payload.password_confirmation});
    return response.status('200').json({
      message: "Password changed!"
    });
  }

}
//test

module.exports = AuthController;
