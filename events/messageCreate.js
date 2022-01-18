const client = require("../index");
// const prefix = require("../models/prefix");
const prefix = (client.config.bot.prefix);

client.on("messageCreate", async (message) => {

    const p = await prefix

    if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(p)
    )
        return;

    const [cmd, ...args] = message.content
        .slice(p.length)
        .trim()
        .split(" ");

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));
    if (message.content === "<a:welp:809125025507573892>") {
        message.reply("<a:welp:809125025507573892>")
    }

    if (!command) return;
    await command.run(client, message, args);
});