const Event = use('Event')
const Mail = use('Mail')
const Env = use('Env')

Event.on('forgot::password', async (forgot_data) => {
    console.log("Event forgot password");
    console.log(forgot_data);
    const user = forgot_data.user;
    var linkreset = Env.get('FRONT_URL')+"/reset_password/"+forgot_data.token;
    console.log("Link generated : ",linkreset);
    await Mail.send('emails.reset_password', {link:linkreset}, (message) => {
        message
            .to(user.email)
            .from(`SAFESHOP<${Env.get('MAIL_SENDER')}>`)
            .subject('Mot de passe oublié | SAFESHOP.fr')
    })
})
Event.on('password::recovered', async (data) => {
    console.log("Event password recovered");
    const user = data.user;
    await Mail.send('emails.password_changed', {
        firstname: user.firstname,
        lastname: user.lastname,
        link:Env.get('FRONT_URL')
    }, (message) => {
        console.log(user);
        message
            .to(user.email)
            .from(`SAFESHOP<${Env.get('MAIL_SENDER')}>`)
            .subject('Mot de passe changé | SAFESHOP.fr')
    })
})
Event.on('password::changed	', async (data) => {
    console.log("Event password changed");
    const user = data.user;
    await Mail.send('emails.password_changed', {
        firstname: user.firstname,
        lastname: user.lastname,
        link: Env.get('FRONT_URL')
    }, (message) => {
        message
            .to(user.email)
            .from(`SAFESHOP<${Env.get('MAIL_SENDER')}>`)
            .subject('Mot de passe changé | SAFESHOP.fr')
    })
})
Event.on('user::created', async (data) => {
    console.log("Event user created");
    console.log(data);
    await Mail.send('emails.user_created', {
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        api_url: Env.get('FRONT_URL'),
        token: data.token
    }, (message) => {
        message
            .to(data.user.email)
            .from(`SAFESHOP<${Env.get('MAIL_SENDER')}>`)
            .subject('Bienvenue sur SAFESHOP !')
    })
})

Event.on('email::changed', async (data) => {
    console.log("Event user changed his email");
    console.log(data);
    await Mail.send('emails.user_email_changed', {
        firstname: data.user.firstname,
        lastname: data.user.lastname,
        api_url: Env.get('FRONT_URL'),
        token: data.token
    }, (message) => {
        message
            .to(data.user.email)
            .from(`SAFESHOP<${Env.get('MAIL_SENDER')}>`)
            .subject('Changement d\'adresse mail | SAFESHOP.fr')
    })
})  