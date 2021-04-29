# discordjs-radio-bot
Simple Discord bot radio using discord.js and ffmpeg

> Prefix: r! (Change it in config.json)

### Setup
* Add .env file with this value: token="YOUR_TOKEN", replace YOUR_TOKEN with your discord bot token ofc!

### Configuration
* Open radioconfig.json and change the URLs. As an example I set the most popular radio in my country.
* Steramurl = A link to the radio stream.
* Apiurl = A link for the radio data, such as the song that is now playing.

Be sure to change the response type in nowplaying.js 
Mine api response is title = "song name", yours can be now_playing = "song name".. so change the lol.title to lol.now_playing in nowplaying.js on line 28
