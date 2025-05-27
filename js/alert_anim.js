import { config } from '../config.js';
import { drinks } from './drinks.js';
import { animate, utils, createTimeline } from '../lib/anime.esm.js';

// Sounds
var glassSnd = new Howl({
    src: '../assets/GlassSlide.wav',
    volume: 0.7,
    preload: true
});
var bellSnd = new Howl({
    src: '../assets/Bell.wav',
    volume: 0.4,
    preload: true
});

// Helper functions
var lastDrink = '';

const switchDrink = (username) => {
    // Random cocktail selection and appareance
    let newDrink = utils.randomPick(drinks);
    let msg = `Enjoy the ${newDrink.name}, ${username}!` ;
    document.getElementById('cocktail').setAttribute('src', `./Drinks/${newDrink.file}`);
    let author = `As created by ${newDrink.creator}`
    utils.set(utils.$('.drink_caption'), {'innerHTML': msg});
    utils.set(utils.$('.drink_creator'), {'innerHTML': author});
    return newDrink.name;
}

const requestedDrink = (username) => {
    lastDrink = switchDrink(username);
    alert_tl.restart();
}

// Streamerbot client set-up
const SBclient = new StreamerbotClient({
    host: '127.0.0.1',
    port: 8080,
    endpoint: '/',
    onConnect: async () => {
        const response = await SBclient.getActions();
        drinkActionId = response.actions.find(action => action['name'] === config.drinkActionName).id;
        chatActionId  = response.actions.find(action => action['name'] === config.chatActionName).id;
    }
});

// Animations
const creator_TextSlide = animate('.drink_creator', {
    y: {from: '-3rem', to: '0rem', delay: 300},
    opacity: {from: 0, to: 1, duration: 500},
    duration: 1000,
    ease: 'outCirc',
    autoplay: false
});

const caption_TextSlide = animate('.drink_caption', {
    y: {from: '5rem', to: '3rem', delay: 300},
    opacity: {from: 0, to: 1, duration: 500},
    duration: 1000,
    ease: 'outCirc',
    autoplay: false
});

const guruguru = animate('.drink_deco', {
    scale: [
        {to: 1.2,   duration: 250, delay: utils.random(500, 1000)},
        {to: 0.8,   duration: 500, delay: 100},
        {to: 1,     duration: 250, delay: 150},
        {to: 1.2,   duration: 250, delay: utils.random(500, 1000)},
        {to: 0.8,   duration: 500, delay: 100},
        {to: 1,     duration: 250, delay: 150},
    ],
    rotate: [
        {to: 180, duration: 2000},
        {from: 180, to: 360, duration: config.drinkDuration, ease: 'linear'}
    ],
    loop: false,
    autoplay: false
});

const coaster = animate('#cocktail', {
    opacity: {from: 0, to: 1, duration: 1000},
    filter: {from: 'blur(5px)', to: 'blur(0px)', duration: 1000},
    scale: {from: 0.6, to: 1, duration: 800, ease: 'outBack(2)'},
    autoplay: false,
});

const showDrink = animate('#drink_container, .drink_deco', {
    opacity: { from: 0, to: 1, duration: 500, composition: 'none'},
    autoplay: false,
    loop: false
});

const hideDrink = animate('#drink_container', {
    opacity: {from: 1, to: 0, duration: 500, composition: 'none'},
    loop: false,
    autoplay: false
});

// Timeline
const alert_tl = createTimeline({
    autoplay: false,
    loop: false,
})
.label('drink')
.sync(showDrink)
.call(() => glassSnd.play())
.sync(coaster, 'drink')
.sync(caption_TextSlide, 'drink')
.sync(creator_TextSlide, 'drink')
.call(() => bellSnd.play())
.sync(guruguru, 'drink')
.sync(hideDrink);

// Event listeners

// DEPRECATED using the SB listener instead
// window.addEventListener('obs-drink-req', function(event) {
//     // console.log(event.detail);
//     let username = `${event.detail.user_req}`;
//     requestedDrink(username);
// });

SBclient.on('Raw.Action', async (action) => {
    if (action.data.actionId == drinkActionId) {
        console.log(chatActionId);
        requestedDrink(action.data.user.display);
        await SBclient.doAction( `${chatActionId}` ,
            {
                "reqUser": action.data.user.name,
                "reqDrink": lastDrink
            }
        );
    }
});