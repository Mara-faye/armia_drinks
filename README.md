# Drinks animated Be Right Back page

Very barebones and hacky way to deliver an animation that will show random cocktails as requested

# Configuration

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

## Important note
Requires the companion Streamer.bot actions that handle chat message and drink count  
Check that Websocket server is set to autostart at `localhost:8080` and that you have the companion actions



### TO-DO
- [x] Variable username 
- [x] Animated arrows
- [x] Audio elements
- [x] Tablet text
- [x] Different presentation in Attract Mode vs. Request
- [x] Separate alert version that will go on top of other scenes
- [x] Resolve outstanding issues with OBS Browser Source (Font, drink, username)
- [x] Fix bug when going back to attract after a request
- [x] Testing and integration of Alert mode. Extra slide animation?
- [x] Refactor to work with streamerbot-client
- [x] Send chat the drink information in Alert
- [ ] Reflect the changes of the Alert system in Attract mode
- [ ] Refactor to use alert_anim as a module
- [ ] Visual feedback as a separate bar receipt 

### ISSUES
- [X] Test actions not calling up a drink. Awaiting further testing to confirm fixed
- [X] Fix Github relative paths. Temptative fix, shouldn't give issues now.


----


For ArmiaStars use only. 2025
