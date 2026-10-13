import { config } from '../config.js';
import { drinks } from './drinks.js';
import { animate, utils, createTimeline } from '../lib/anime.esm.js';
import * as alert from './alert_anim.js'
import { SBclient } from './streamerbot.js'

var lastDrink = '';
const mixers = ['tail', 'dust', 'cosmo', 'tears', 'milky', 'nebula'];

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
.sync(alert.showDrink)
.sync(alert.coaster, 'attractDrink')
.sync(alert.caption_TextSlide, 'attractDrink')
.sync(alert.creator_TextSlide, 'attractDrink')
.add({duration: config.attractDrinkDuration})
.sync(alert.hideDrink)

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
.sync(alert.showDrink)
.sync(alert.coaster, 'drink')
.sync(alert.caption_TextSlide, 'drink')
.sync(alert.creator_TextSlide, 'drink')
.sync(alert.guruguru, 'drink')
.sync(alert.hideDrink);

// Action when a drink is called from SB

const requestedDrink_brb = (username) => {
    alert.hideDrink.complete();
    emptyAll();
    toggleGroup('shaker', '00');
    attractmode_tl.revert();
    Howler.volume(config.requestVolume);
    lastDrink = alert.switchDrink(username);
    request_tl.play();
};



SBclient.on('Raw.Action', async (action) => {
    if (action.data.actionId == drinkActionId) {
        let user = (action.data.user) ?
            { display: action.data.user.display, name: action.data.user.name } :
            { display: 'Placeholder', name: 'armiastars' }; 
        requestedDrink_brb(user.display);
        await SBclient.doAction( `${chatActionId}` ,
            {
                "reqUser": user.name,
                "reqDrink": lastDrink
            }
        );
    }
});