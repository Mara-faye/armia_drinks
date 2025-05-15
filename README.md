# Drinks animated Be Right Back page

Very barebones and hacky way to deliver an animation that will show random cocktails as requested

Config variable in `brb_anim.js` allows for easy adjustment
- mainloopDelay: Wait time between demo animation
- arrowsSpeed: Arrow animation speed. Lower is faster
- arrowsDelay: Wait time between arrow animations
- ribbonSpeed: Text scroll speed for tablet ribbon text. Higher is slower

Requires sending a OBS Raw websocket message to specify a username due to the SB integration.
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
		"user_drinks": "%testDrink%"
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
- Different presentation in Attract Mode vs. Request
- Separate alert version that will go on top of other scenes
- Ability to specify cocktail?
- ~~Resolve outstanding issues with OBS Browser Source (Font, drink, username)~~
----

For ArmiaStars use only. 2025
