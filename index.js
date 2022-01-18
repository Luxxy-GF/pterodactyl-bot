const Discord = require('discord.js');
const { Collection } = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });

module.exports = client;

const fs = require('fs');
client.categories = fs.readdirSync("./commands/");
client.aliases = new Collection();
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

require("./handler")(client);

client.login(client.config.bot.token);