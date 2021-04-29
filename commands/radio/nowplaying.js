const discord = require("discord.js");
const { readdirSync } = require("fs");
const request = require('request');
const config = require('../../radioconfig.json');

module.exports.run = async (bot, message, args) => {
        if (!message.member.voice.channel) {
          message.channel.send("You need to be in a voice channel");
          return
        }
        let nowplaying

        function getData() {
          return new Promise(function (resolve, reject) {
            request(config.apiurl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              const data = JSON.parse(body);
               resolve(data);
            } else {
              reject(error);
            }
            });
          });
        }

        async function setData() {
          const lol = await getData();
          nowplaying = lol.title;
          let embed = new discord.MessageEmbed()
            .setTitle(`Now Playing`)
            .setColor(`#1DAB64`)
            .setDescription(`${nowplaying}`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
            .setTimestamp();
           message.channel.send(embed) 
           return;
        }

        setData();


};
module.exports.help = {
  name: "nowplaying",
  description: "",
  usage: "",
  category: "radio",
  aliases: ["np"]
}