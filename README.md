# Drinks animated Be Right Back page

Very barebones and hacky way to deliver an animation that will show random cocktails as requested

Config file `config.js` allows for easy adjustment
- attractDelay: Wait time between demo animation loops
- attractLoopDelay: Wait time before the demo loop first starts
- attractSelectSpeed: How fast mixer bottles are selected in demo
- attractVolume: Global volume for demo loop

- requestSelectSpeed: How fast mixer bottles are selected when a drink's been requested
- requestVolume: Global volume during request animation

- arrowsSpeed: Arrow animation speed. Lower is faster
- arrowsDelay: Wait time between arrow animations

- ribbonSpeed: Text scroll speed for tablet ribbon text. Higher is slower

- drinkDuration: How long the drink stays on the screen
- attractDrinkDuration: How long the drink stays on the screen during Attract mode. Faster than the regular.

- drinkActionName: Name of the Streamer.bot action that is tied to the Twitch Redeem
- chatActionName: Name of the Streamer.bot action that sends an optional chat message


Requires the companion Streamer.bot actions that handle chat message and drink count



### TO-DO
- ~~Variable username~~ 
- ~~Animated arrows~~
- ~~Audio elements~~
- ~~Tablet text~~
- ~~Different presentation in Attract Mode vs. Request~~
- ~~Separate alert version that will go on top of other scenes~~
- ~~Resolve outstanding issues with OBS Browser Source (Font, drink, username)~~
- ~~Fix bug when going back to attract after a request~~
- ~~Testing and integration of Alert mode. Extra slide animation?~~
- ~~Refactor to work with streamerbot-client~~
- Send chat the drink information in Alert           
----


For ArmiaStars use only. 2025
