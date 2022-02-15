# Enigma JS
The original 1930s Enigma with the same logic and a minimalist and modern look. have fun playing around.  
You can try it out at [here](https://nimaaskarian.github.io/enigma-js/).  
Just don't send daily weather reports with it and be careful about who you hail.  
## Installation
You don't need to install enigma-js on your local PC, as its hosted on github. but if you wanted to, you can download the zip version of this projects master branch and extract it on your local computer. 
I recommend to you to use [`serve`](https://www.npmjs.com/package/serve) or some type of static local server utility to open this project up on your browser.
## Changing the settings
You can change its settings using apps GUI or import your friends settings by drag and dropping your friend's `settings.json` in "Import json" button at the settings  
  
You can pick 3 rotors from 9 rotors (0,8).  
You can set a ring number for each rotor (0,25).  
You can add up to 13 plugs which convert 2 letters to each other on plugboard (["ab","cd"] means "a" will be converted to "b", "c" will be converted to "d" and vice verca) 
## Advanced
if you're a power user and you know how to play around with JS, navigate to `./js/utils.js` and use `rotorConstructor` function to create your own rotor wire sets.  
then you can add the settings that you created as a array of number to `./js/enigma.js>_ROTOR_SETTINGS`
