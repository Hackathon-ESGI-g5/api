'use strict'

const Persona = use('Persona');

class AuthController {

  async register ({ request, response }) {
    const payload = request.only(['email', 'password', 'password_confirmation', 'firstname', 'lastname']);
    const user = await Persona.register(payload);
    return response.ok({
      user,
      status: 200,
      message: 'Client account created successfully',
    })
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
  }

  async updatePasswordByToken ({ request }) {
    const token = request.input('token');
    const payload = request.only(['password', 'password_confirmation']);
    await Persona.updatePasswordByToken(token, payload);
  }

}
//test

module.exports = AuthController;
