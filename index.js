const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const router = express.Router();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/pub/index.html'));
});
app.use('/', router);

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);

const config = require('./config.json');
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { sep } = require('path');

const bot = new Client();

bot.config = config;

['commands', 'aliases'].forEach(x => (bot[x] = new Collection()));

const load = (dir = './commands/') => {
	readdirSync(dir).forEach(dirs => {
		const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files =>
			files.endsWith('.js')
		);

		for (const file of commands) {
			const pull = require(`${dir}/${dirs}/${file}`);
			if (
				pull.help &&
				typeof pull.help.name === 'string' &&
				typeof pull.help.category === 'string'
			) {
				if (bot.commands.get(pull.help.name))
					return console.warn(
						`Two or more commands have the same name ${
							pull.help.name
						}.`
					);
				bot.commands.set(pull.help.name, pull);
			  console.log(`Loaded command ${pull.help.name}.`);
			} else {
				console.log(
					`Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`
				);
				continue;
			}
			if (pull.help.aliases && typeof pull.help.aliases === 'object') {
				pull.help.aliases.forEach(alias => {
					if (bot.aliases.get(alias))
						return console.warn(
							`Two commands or more commands have the same aliases ${alias}`
						);
					bot.aliases.set(alias, pull.help.name);
				});
			}
		}
	});
};

load();

bot.on('message', async message => {
	const prefix = bot.config.prefix;
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	let command;

	if (message.author.bot || !message.guild) return;

	if (!message.member)
		message.member = await message.guild.fetchMember(message.author);

	if (!message.content.startsWith(prefix)) return;

	if (cmd.length === 0) return;
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
	else if (bot.aliases.has(cmd))
		command = bot.commands.get(bot.aliases.get(cmd));

	if (command) command.run(bot, message, args);
});


bot.on('ready', async () => {
	console.log(`${bot.user.username} is ready for action!`);
	if (config.activity.streaming == true) {
		bot.user.setActivity(bot.activity.game, {
			url: 'https://twitch.tv/username'
		});
	} else {
		bot.user.setActivity(config.activity.game, { type: 'WATCHING' }); //PLAYING, LISTENING, WATCHING
		bot.user.setStatus('online'); // dnd, idle, online, invisible
	}
});
console.log(config.activity.game);

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

bot.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
    return;
  if (!oldState.channel.members.size - 1) 
    setTimeout(() => {
      if (!oldState.channel.members.size - 1)
         oldState.channel.leave();
     }, 5000);
});

bot.login(process.env['token']);