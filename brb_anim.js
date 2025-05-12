var anime;
const {
    animate,
    utils,
    createTimeline,
    createTimer,
    eases
} = anime;
const mixers = ['tail', 'dust', 'cosmo', 'tears', 'milky', 'nebula'];

// Global variables for easy adjustment
const config = {
    demoName: 'testUser42',
    mainloopDelay: 2000,
};


// Sound cues configuration
var shakerSnd = new Howl({
    src: './assets/ShakerSound.wav',
    volume: 0.4,
    loop: false,
    preload: true,
    autoplay: false
});
var pourSnd = new Howl({
    src: './assets/pouring-drink.mp3',
    volume: 0.3,
    preload: true
});
var iceSnd = new Howl({
    src: './assets/Icecube.wav',
    volume: 0.2,
    preload: true
});
var glassSnd = new Howl({
    src: './assets/GlassSlide.wav',
    volume: 0.7,
    preload: true
});
var selectSnd = new Howl({
    src: './assets/screen-select-1.wav',
    volume: 0.4,
    preload: true
});
var selectDoneSnd = new Howl({
    src: './assets/screen-select-2.wav',
    volume: 0.4,
    preload: true
});


const toggleGroup = (group, target) => {
    // Quick way to toggle only a given state of the bottle groups
    document.getElementById(`${group}_${target}`).classList.remove('hidden');
    document.querySelectorAll(`.${group}`).forEach(el => {
        el.id != `${group}_${target}` && el.classList.add('hidden');
    });
}

const checkMixer = (mixer) => {
    let current = document.querySelectorAll(`img.${mixer}:not(.hidden)`)[0];
    let currentIndex = current.id.substring(current.id.length - 2);
    return currentIndex < 3 ? `0${parseInt(currentIndex)+1}` : false;
}

const buildMix = () => {
    let mixer = utils.randomPick(mixers);
    let nextMix = checkMixer(mixer);
    // console.info(`Picked candidate ${mixer} ${nextMix}`);
    return nextMix ? addMix(mixer, nextMix) : buildMix();
}

const emptyAll = () => {
    mixers.forEach(el => toggleGroup(el, '00'));
    toggleGroup('shaker', '00');
}

const switchDrink = () => {
    let newDrink = utils.randomPick(drinks);
    const urlParams = new URLSearchParams(window.location.search);
    let userName = urlParams.get('un') ? urlParams.get('un') : config.demoName;
    utils.set(utils.$('#cocktail'), {
        'src': `./Drinks/${newDrink.file}`
    });
    let msg = `Enjoy the ${newDrink.name}, ${userName}!`;
    let author = `As created by ${newDrink.creator}`
    utils.set(utils.$('.drink_caption'), {'innerHTML': msg});
    utils.set(utils.$('.drink_creator'), {'innerHTML': author});
    return newDrink.name;
}

const addMix = (mixer, nextMix) => {
    toggleGroup(mixer, nextMix);
    anime.animate(`.${mixer}`, {
        y: '-50px',
        scale: 1.2,
        rotate: utils.random(-5 , 5) + 'deg',
        duration: 200,
        loop: 1,
        alternate: true,
        onComplete: utils.cleanInlineStyles
    });
}

const shakeshake = anime.animate('.shaker', {
    rotate: [0, -9, 9, -9, 9, -9, 9, -9, 0],
    duration: 1500,
    ease: 'outBack(3)',
    loop: false,
    autoplay: false,
    onComplete: utils.cleanInlineStyles
});

const textSlide = anime.animate('.drink_caption, .drink_creator', {
    y: {from: '-3rem', to: '2rem', delay: 300},
    opacity: {from: 0, to: 1, duration: 500},
    duration: 1000,
    ease: 'outCirc',
    autoplay: false
});

const guruguru = anime.animate('.drink_deco', {
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
        {from: 180, to: 360, duration: 4000, ease: 'linear'}
    ],
    opacity: [
        {from: 0, to: 1, duration: 500}
    ],
    duration: 10000,
    loop: false,
    autoplay: false,
});

const coaster = anime.animate('#cocktail', {
    opacity: {to: 1, duration: 1000},
    filter: {from: 'blur(5px)', to: 'blur(0px)', duration: 1000},
    scale: {from: 0.6, to: 1, duration: 800, ease: 'outBack(2)'},
    autoplay: false,
});

// Extract this one for a separate definition
// const alert_tl = anime.createTimeline()
// .call(() => switchDrink())
// .sync(guruguru)
// .sync(coaster, '<<')
// .sync(textSlide, '<');

// Main Demo loop
const attractmode_tl = anime.createTimeline({
    loop: true,
    loopDelay: config.mainloopDelay
})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '01'))
.call(() => selectSnd.play())
.add({duration: 1000})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '02'))
.call(() => selectSnd.play())
.add({duration: 1000})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '03'))
.call(() => selectSnd.play())
.add({duration: 1000})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '04'))
.call(() => selectDoneSnd.play())
.add({duration: 1000})
.sync(shakeshake)
.call(() => shakerSnd.play(), '<<')
.call(() => shakerSnd.play(), '<<+=500')
.add ({duration: 300})
.call(() => emptyAll())
.call(() => pourSnd.play())
.call(() => iceSnd.play(), '<<+=1200')
.add({duration: 2000})
.call(() => glassSnd.play())
.call(() => switchDrink())
.sync(guruguru)
.sync(coaster, '<<')
.sync(textSlide, '<');