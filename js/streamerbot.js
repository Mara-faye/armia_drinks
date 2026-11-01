import { utils } from '../lib/anime.esm.js';
import { config } from '../config.js';

// Streamerbot client set-up
export const SBclient = new StreamerbotClient({
    host: '127.0.0.1',
    port: 8080,
    endpoint: '/',
    onConnect: async (data) => {
        utils.set(utils.$('#info'), {'innerHTML': 'SB Connected!', 'opacity': '0%'});
        const response = await SBclient.getActions();
        SBclient.drinkActionId = response.actions.find(action => action['name'] === config.drinkActionName).id;
        SBclient.chatActionId  = response.actions.find(action => action['name'] === config.chatActionName).id;
        console.info({ 
            drinkActionId: SBclient.drinkActionId, 
            chatActionId: SBclient.chatActionId 
        });
    },
    onError: (err) => {
        console.error('Streamer.bot Client Error', err);
        utils.set(utils.$('#info'), {'innerHTML': `SB Connection Failed: ${err}`, 'opacity': '80%'});
    }
});