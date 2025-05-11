var anime;
const {
    animate,
    utils,
    createTimeline,
    createTimer,
    eases
} = anime;
const mixers = ['tail', 'dust', 'cosmo', 'tears', 'milky', 'nebula'];


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
    let userName = urlParams.get('un') ? urlParams.get('un') : 'demoName';
    utils.set(utils.$('#cocktail'), {
        'src': `./Drinks/${newDrink.file}` // IMPORTANT switch the route when uploading to Glitch
        // 'src': `https://cdn.glitch.global/bb0cb468-bc7d-47d6-82ec-351af80e09b2/${newDrink.file}` 
    });
    let msg = `Enjoy the ${newDrink.name}, ${userName} !`;
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


const alert_tl = anime.createTimeline()
.call(() => switchDrink())
.sync(guruguru)
.sync(coaster, '<<')
.sync(textSlide, '<');


const tl = anime.createTimeline({
    loop: true,
    loopDelay: 2000
})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '01'))
.add({duration: 1000})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '02'))
.add({duration: 1000})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '03'))
.add({duration: 1000})
.call(() => buildMix())
.call(() => toggleGroup('shaker', '04'))
.add({duration: 1000})
.sync(shakeshake)
.add ({duration: 500})
.call(() => emptyAll())
.sync(alert_tl)