const discord = require("discord.js");
const { readdirSync } = require("fs");
const config = require('../../radioconfig.json');

module.exports.run = async (bot, message, args) => {
  if (!message.member.voice.channel) { 
    message.channel.send('You\'re not in a voice channel').then(message => message.delete(4000));
    return
	} else {
    let radiostream = config.streamurl;
    try {
      message.member.voice.channel.join()
        .then(connection => {
            let embed = new discord.MessageEmbed()
            .setTitle(`Playing`)
            .setColor(`#00B50F`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
            .setTimestamp();
            message.channel.send(embed)
            return connection.play(radiostream)
        })
        .then(dispatcher => {
          dispatcher.on('error', console.error)
        })
    } catch (ex) {
      console.log(ex.stack);
    }
}};
module.exports.help = {
  name: "play",
  description: "",
  usage: "",
  category: "radio",
  aliases: [""]
}