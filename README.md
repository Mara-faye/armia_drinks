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


Requires sending a OBS Raw websocket message to specify a username. This is to integrate Streamer.bot properly for handling Twitch Reward requests. 
`UserDrink` variable is not used at the moment in the visualization.

```
{
  "requestType": "CallVendorRequest",
  "requestData": {
    "vendorName": "obs-browser",
    "requestType": "emit_event",
    "requestData": {
      "event_name": "obs-drink-req",
      "event_data": {
        "user_req": "%user%",
        "user_drinks": "%UserDrink%"
      }
    }
  }
}
```

### TO-DO
- ~~Variable username~~ 
- ~~Animated arrows~~
- ~~Audio elements~~
- ~~Tablet text~~
- ~~Different presentation in Attract Mode vs. Request~~
- ~~Separate alert version that will go on top of other scenes~~
- ~~Resolve outstanding issues with OBS Browser Source (Font, drink, username)~~
- ~~Fix bug when going back to attract after a request~~
- Testing and integration of Alert mode. Extra slide animation?
----

Replace the Twich Redeem Action with Delivery
For ArmiaStars use only. 2025
