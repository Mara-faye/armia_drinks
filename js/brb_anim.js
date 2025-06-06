import { config } from '../config.js';
import { drinks } from './drinks.js';
import { animate, utils, createTimeline } from '../lib/anime.esm.js';

const mixers = ['tail', 'dust', 'cosmo', 'tears', 'milky', 'nebula'];

// Drink container not sticking to opacity: 0 on Attract loop restart
// Please check that out before update, but focus on Alert for now
// Fix Event Listener to follow either Twitch.RewardRedemption of Raw.Action

// Sound cues configuration
var shakerSnd = new Howl({
    src: '../assets/ShakerSound.wav',
    volume: 0.4,
    loop: false,
    preload: true,
    autoplay: false
});
var pourSnd = new Howl({
    src: '../assets/pouring-drink.mp3',
    volume: 0.3,
    preload: true
});
var iceSnd = new Howl({
    src: '../assets/Icecube.wav',
    volume: 0.2,
    preload: true
});
var glassSnd = new Howl({
    src: '../assets/GlassSlide.wav',
    volume: 0.7,
    preload: true
});
var selectSnd = new Howl({
    src: '../assets/screen-select-1.wav',
    volume: 0.4,
    preload: true
});
var selectDoneSnd = new Howl({
    src: '../assets/screen-select-2.wav',
    volume: 0.4,
    preload: true
});

// HELPER FUNCTIONS
const toggleGroup = (group, target) => {
    // Quick way to toggle only a given state of the bottle groups
    document.getElementById(`${group}_${target}`).classList.remove('hidden');
    document.querySelectorAll(`.${group}`).forEach(el => {
        el.id != `${group}_${target}` && el.classList.add('hidden');
    });
}

const checkMixer = (mixer) => {
    // Doesn't go over 3 blips per mixer bottle
    let current = document.querySelectorAll(`img.${mixer}:not(.hidden)`)[0];
    let currentIndex = current.id.substring(current.id.length - 2);
    return currentIndex < 3 ? `0${parseInt(currentIndex)+1}` : false;
}

const buildMix = () => {
    let mixer = utils.randomPick(mixers);
    let nextMix = checkMixer(mixer);
    return nextMix ? addMix(mixer, nextMix) : buildMix();
}

const emptyAll = () => {
    mixers.forEach(el => toggleGroup(el, '00'));
}

const mix_in_shaker = (level) => {
    buildMix();
    toggleGroup('shaker', level);
    level == '04' ? selectDoneSnd.play() : selectSnd.play();
}

const switchDrink = (username) => {
    // Random cocktail selection and appareance
    let newDrink = utils.randomPick(drinks);
    let msg = username==null ? `Armia made herself a ${newDrink.name}~` :
        `Enjoy the ${newDrink.name}, ${username}!` ;
    document.getElementById('cocktail').setAttribute('src', `./Drinks/${newDrink.file}`);
    let author = `As created by ${newDrink.creator}`
    utils.set(utils.$('.drink_caption'), {'innerHTML': msg});
    utils.set(utils.$('.drink_creator'), {'innerHTML': author});
    return newDrink.name;
}

let drinkActionId, chatActionId = '';
var lastDrink = '';

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


// ANIMATIONS
// Picks a bottle of mixer
const addMix = (mixer, nextMix) => {
    toggleGroup(mixer, nextMix);
    animate(`.${mixer}`, {
        y: '-50px',
        scale: 1.2,
        rotate: utils.random(-5 , 5) + 'deg',
        duration: 200,
        loop: 1,
        alternate: true,
        onComplete: utils.cleanInlineStyles
    });
}

// Shaker going side to side
const shakeshake = animate('.shaker', {
    rotate: [0, -9, 9, -9, 9, -9, 9, -9, 0],
    duration: 1500,
    ease: 'outBack(3)',
    loop: false,
    autoplay: false,
    onComplete: utils.cleanInlineStyles
});

// Drink being poured out of shaker
const pourShaker = animate('.shaker', {
    y: {
        to: '-8rem',
        duration: 1200,
        ease: 'outBack(3)'
    },
    x: {
        to: '8rem',
        duration: 1200,
        delay: 0,
        ease: 'outQuad'
    },
    rotate: {
        to: '-100deg',
        duration: 800,
        delay: 200,
        ease: 'outQuad',
        composition: 'none'
    },
    autoplay: false,
    alternate: true,
    loop: 1
});

// Text caption sliding from the top
const creator_TextSlide = animate('.drink_creator', {
    y: {from: '-3rem', to: '2rem', delay: 300},
    opacity: {from: 0, to: 1, duration: 500},
    duration: 1000,
    ease: 'outCirc',
    autoplay: false
});

const caption_TextSlide = animate('.drink_caption', {
    y: {from: '5rem', to: '2rem', delay: 300},
    opacity: {from: 0, to: 1, duration: 500},
    duration: 1000,
    ease: 'outCirc',
    autoplay: false
});

// Show the neon decoration in a very decadent transition
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

// Displays the chosen drink
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

// Hides the whole thing
const hideDrink = animate('#drink_container', {
    opacity: {from: 1, to: 0, duration: 500, composition: 'none'},
    loop: false,
    autoplay: false
});

// Neon Arrows timeline loop. Adjust timings with config
const arrowneons_on_tl = createTimeline({
    autoplay: false
})
.call(() => toggleGroup('arrows', '01'))
.add({duration: config.arrowsSpeed})
.call(() => toggleGroup('arrows', '02'))
.add({duration: config.arrowsSpeed})
.call(() => toggleGroup('arrows', '03'))
.add({duration: config.arrowsDelay});

const arrowneons_off_tl = createTimeline({
    autoplay: false
})
.call(() => toggleGroup('arrows', '04'))
.add({duration: config.arrowsSpeed})
.call(() => toggleGroup('arrows', '05'))
.add({duration: config.arrowsSpeed})
.call(() => toggleGroup('arrows', '06'))
.add({duration: config.arrowsDelay});

const arrowneons_seq_tl = createTimeline({
    autoplay: false
})
.call(() => toggleGroup('arrows', '01'))
.add({duration: config.arrowsSpeed})
.call(() => toggleGroup('arrows', '06'))
.add({duration: config.arrowsSpeed})
.call(() => toggleGroup('arrows', '07'))
.add({duration: config.arrowsDelay});

const arrowneons_tl = createTimeline({
    autoplay: true,
    loop: true,
    delay: config.arrowsDelay,
    loopDelay: config.arrowsDelay
})
.sync(arrowneons_on_tl)
.sync(arrowneons_on_tl)
.sync(arrowneons_off_tl)
.sync(arrowneons_off_tl)
.sync(arrowneons_seq_tl)
.sync(arrowneons_on_tl)
.sync(arrowneons_off_tl)
.sync(arrowneons_seq_tl);

// Tablet text timeline loop
const ribbontxt = animate('#tablet_txt', {
    x: {to: '-52rem', duration: config.ribbonSpeed},
    autoplay: true,
    loop: true,
    ease: 'linear'
});

// Main Attract mode timeline loop. Reduced animation and sound volume
const attractmode_tl = createTimeline({
    autoplay: true,
    loop: true,
    delay: config.attractDelayDelay,
    loopDelay: config.attractLoopDelay
})
.call(() => Howler.volume(config.attractVolume))
.call(() => mix_in_shaker('01'))
.add({duration: config.attractSelectSpeed})
.call(() => mix_in_shaker('02'))
.add({duration: config.attractSelectSpeed})
.call(() => mix_in_shaker('03'))
.add({duration: config.attractSelectSpeed})
.call(() => mix_in_shaker('04'))
.add({duration: config.attractSelectSpeed})
.sync(shakeshake)
.call(() => shakerSnd.play(), '<<')
.call(() => shakerSnd.play(), '<<+=500')
.add ({duration: 300})
.call(() => emptyAll())
.call(() => switchDrink()) 
.sync(pourShaker)
.call(() => pourSnd.play(), '<<')
.call(() => iceSnd.play(), '<<+=1200')
.call(() => toggleGroup('shaker', '00'))
.add({duration: 500})
.call(() => glassSnd.play())
.label('attractDrink')
.sync(showDrink)
.sync(coaster, 'attractDrink')
.sync(caption_TextSlide, 'attractDrink')
.sync(creator_TextSlide, 'attractDrink')
.add({duration: config.attractDrinkDuration})
.sync(hideDrink)


// Request drink timeline. No loop, reverts to attract after playing out
const request_tl = createTimeline({
        autoplay: false,
        loop: false,
        onComplete: () => {
            request_tl.revert();
            attractmode_tl.restart();
        }
    })
    .call(() => mix_in_shaker('01'))
    .add({duration: config.requestSelectSpeed})
    .call(() => mix_in_shaker('02'))
    .add({duration: config.requestSelectSpeed})
    .call(() => mix_in_shaker('03'))
    .add({duration: config.requestSelectSpeed})
    .call(() => mix_in_shaker('04'))
    .add({duration: config.requestSelectSpeed})
    .sync(shakeshake)
    .call(() => shakerSnd.play(), '<<')
    .call(() => shakerSnd.play(), '<<+=500')
    .add ({duration: 300})
    .call(() => emptyAll())
    .sync(pourShaker)
    .call(() => pourSnd.play(), '<<')
    .call(() => iceSnd.play(), '<<+=1200')
    .call(() => toggleGroup('shaker', '00'))
    .add({duration: 500})
    .call(() => glassSnd.play())
    .label('drink')
    .sync(showDrink)
    .sync(coaster, 'drink')
    .sync(caption_TextSlide, 'drink')
    .sync(creator_TextSlide, 'drink')
    .sync(guruguru, 'drink')
    .sync(hideDrink);

const requestedDrink = (username) => {
    hideDrink.complete();
    emptyAll();
    toggleGroup('shaker', '00');
    attractmode_tl.revert();
    Howler.volume(config.requestVolume);
    lastDrink = switchDrink(username);
    request_tl.play();
};

SBclient.on('Raw.Action', async (action) => {
    if (action.data.actionId == drinkActionId) {
        requestedDrink(action.data.user.display);
        await SBclient.doAction( `${chatActionId}` ,
            {
                "reqUser": action.data.user.name,
                "reqDrink": lastDrink
            }
        );
    }
});

// DEPRECATED But keeping the knowledge just in case

// Drink requested as determined by OBS Websocket message
// window.addEventListener('obs-drink-req', function(event) {
//     // console.log(event.detail);
//     let username = `${event.detail.user_req}`;
//     requestedDrink(username);
// });

// Work attached to Twitch rather than SB action. Better to leave it triggered on SB instead

// SBclient.on('Twitch.RewardRedemption', (data) => {
//     if (data.data.reward.title == "Daily Drink") {
//         requestedDrink(data.data.user_name);
//         SBclient.doAction({"name": 'Drink Chat feedback'},
//             {
//                 "reqUser": data.data.user_login,
//                 "reqDrink": lastDrink
//             }
//         );
//     }
// });
