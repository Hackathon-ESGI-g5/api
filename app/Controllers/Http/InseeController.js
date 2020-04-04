'use strict'
const Config = use('Config')
const Env = use('Env')
const fetch = require('node-fetch')

class InseeController {
    async getBySiret({params,response,auth}){
        const siret = params.siret;
        const insee_token = await Config.get('insee.key');
        console.log("insee.key",insee_token);
        await fetch('https://api.insee.fr/entreprises/sirene/V3/siret/'+siret,{
            method: 'GET',
            headers: { 
                "Content-type": "application/json",
                Authorization: `Bearer ${insee_token}`
            }
        }).then(async res => {
            var rp = await res.json();
            return response.status(rp.header.statut).json(rp);
        }).catch(async err => {
            console.log(err);
            await this.generateToken().then((value) => {
                return this.getBySiret({params,response});
            }).catch((e) => {
                return response.status(400).json({
                    status: "Error",
                    message: "Insee API currently not available",
                    stack_trace: e.message
                });
            });
        });
    }

    async generateToken(){
        //Config
        console.log('GENERATE INSEE TOKEN');
        //const bas64 = Base64(Env.get('INSEE_CONSUMER_KEY')+":"+Env.get('INSEE_CONSUMER_SECRET'));
        const bas64 = Buffer.from(Env.get('INSEE_CONSUMER_KEY')+":"+Env.get('INSEE_CONSUMER_SECRET')).toString('base64');
        return new Promise(async (resolve, reject) => {
            await fetch('https://api.insee.fr/token?grant_type=client_credentials&validity_period=2400000',{
                method: 'POST',
                headers: {
                    Authorization: `Basic ${bas64}`
                }
            }).then(async res => {
                var rp = await res.json();
                console.log("INSEE TOKEN GENERATED !",rp);
                if(rp.access_token != null){
                    await Config.set('insee.key', rp.access_token);
                    console.log("INSEE TOKEN STORED !",Config.get('insee.key'));
                    resolve();
                } else {
                    console.log("INSEE THROW");
                    reject('Token not given, error on format or credentials to INSEE API');
                }
            }).catch(async err => {
                console.log("ERROR ON INSEE TOKEN GENERATION : ",err);
                reject(err.message);
            });
        })
    }
}

module.exports = InseeController
