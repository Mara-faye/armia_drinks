import { config } from '../config.js';
import { drinks as drinks_00 } from './drinks_season00.js';
import { drinks as drinks_01 } from './drinks_season01.js';

// Ready for switching to JSON format built from ingest.js
// import drinks_00 from './drinks_s00.json' with { type: 'json' };
// import drinks_01 from './drinks_s01.json' with { type: 'json' };
import { animate, utils, createTimeline } from '../lib/anime.esm.js';
import { SBclient } from './streamerbot.js';


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
    // Random season selection
    let drinks = Math.random() < config.seasonChance ? drinks_00 : drinks_01;

    // Random cocktail selection and appareance
    let newDrink = utils.randomPick(drinks);
    if (newDrink.name == lastDrink) {
        //reroll in case it's the same twice in a row
        newDrink = utils.randomPick(drinks);
        console.info('Rerolled!');
    };
    let msg = `Enjoy the ${newDrink.name}, ${username}!` ;
    document.getElementById('cocktail').setAttribute('src', `./Drinks/${newDrink.file}`);
    let author = `As created by ${newDrink.creator}`
    utils.set(utils.$('.drink_caption'), {'innerHTML': msg});
    utils.set(utils.$('.drink_creator'), {'innerHTML': author});
    console.info(newDrink);

    return newDrink.name;
}

const requestedDrink = (username) => {
    lastDrink = switchDrink(username);
    alert_tl.restart();
}

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
SBclient.on('Raw.Action', async (action) => {
    if (action.data.actionId == SBclient.drinkActionId) {
        console.info('Drink requested!');
        let user = (action.data.user) ?
            { display: action.data.user.display, name: action.data.user.name } :
            { display: 'Placeholder', name: 'armiastars' }; 
        requestedDrink(user.display);
        await SBclient.doAction( SBclient.chatActionId,
            {
                "reqUser": user.name,
                "reqDrink": lastDrink
            }
        );
    }
});

export { switchDrink, 
    alert_tl, 
    caption_TextSlide, creator_TextSlide,
    coaster, guruguru,
    showDrink, hideDrink }