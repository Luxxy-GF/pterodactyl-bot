const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const ascii = require('ascii-table')
const { readdirSync } = require("fs"); //requireing, the module for reading files 
let table = new ascii("Commands");

table.setHeading('Command', ' Load status');

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    readdirSync("./commands/").forEach(dir => { //reading each command
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js")); //it will be only a command if it ends with .js
        for (let file of commands) { //for each file which is a command
            let pull = require(`../commands/${dir}/${file}`); //get informations
            if (pull.name) { //get the name of the command
                client.commands.set(pull.name, pull); //set the name of the command
                table.addRow(file, 'Ready'); //log in table ready
            } else {
                table.addRow(file, `error -> missing a help.name, or help.name is not a string.`); //if something wents wrong, do this
                continue; //and skip
            }
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name)); //if there are aliases, do it too
        }
        console.log(table.toString()); //showing the table
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        await client.guilds.cache
            .get(client.config.bot.testguild)
            .commands.set(arrayOfSlashCommands);

        // Register for all the guilds the bot is in
        // await client.application.commands.set(arrayOfSlashCommands);
    });
};