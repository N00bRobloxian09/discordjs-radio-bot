const discord = require("discord.js");
const { readdirSync } = require("fs");

module.exports.run = async (bot, message, args) => {
        if (!message.member.voice.channel) {
          message.channel.send("You need to be in a voice channel");
          return
        }
        message.member.voice.channel.leave()
        let embed = new discord.MessageEmbed()
        .setTitle(`Disconnected`)
        .setColor(`#B50015`)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
        .setTimestamp();
        message.channel.send(embed)
};
module.exports.help = {
  name: "disconnect",
  description: "",
  usage: "",
  category: "radio",
  aliases: ["dis"]
}