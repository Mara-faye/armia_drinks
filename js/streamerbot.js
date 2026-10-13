import { StreamerbotClient } from "../lib/streamerbot-client.js"

let drinkActionId = '';
let chatActionId = '';

// Streamerbot client set-up
export const SBclient = new StreamerbotClient({
    host: '127.0.0.1',
    port: 8080,
    endpoint: '/',
    onConnect: async (data) => {
        utils.set(utils.$('#info'), {'innerHTML': 'SB Connected!', 'opacity': '0%'});
        const response = await SBclient.getActions();
        drinkActionId = response.actions.find(action => action['name'] === config.drinkActionName).id;
        chatActionId  = response.actions.find(action => action['name'] === config.chatActionName).id;
    },
    onError: (err) => {
        console.error('Streamer.bot Client Error', err);
        utils.set(utils.$('#info'), {'innerHTML': `SB Connection Failed: ${err}`, 'opacity': '80%'});
    }
});